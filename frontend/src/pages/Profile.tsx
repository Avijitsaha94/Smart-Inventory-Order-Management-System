/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  User, Mail, Shield, Calendar, Save,
  Lock, Eye, EyeOff, CheckCircle, AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import Layout from '../components/layout/Layout';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from '../redux/api/profileApi';
import { setCredentials } from '../redux/slices/authSlice';
import type { RootState } from '../redux/store';
import toast from 'react-hot-toast';

type ProfileUser = NonNullable<ReturnType<typeof useGetProfileQuery>['data']>['data'];

function Profile() {
  const { data, isLoading } = useGetProfileQuery();

  // Don't mount the real content (and don't create profileForm state) until
  // the profile has actually loaded. This is what lets the child component
  // seed its state directly from `user`, with no effect required to sync it
  // in later.
  if (isLoading || !data?.data) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4" />
            <div className="card dark:bg-slate-800 h-48" />
            <div className="card dark:bg-slate-800 h-64" />
          </div>
        </div>
      </Layout>
    );
  }

  // `key` forces a clean remount (and therefore a fresh profileForm initial
  // state) if the underlying user ever changes, e.g. switching accounts.
  return <ProfileContent key={data.data.email} user={data.data} />;
}

function ProfileContent({ user }: { user: ProfileUser }) {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state: RootState) => state.auth);

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  // Seeded once at mount time from `user`, which the parent already
  // guarantees is loaded — no effect + setState needed to "catch up".
  const [profileForm, setProfileForm] = useState({ name: user.name, email: user.email });
  const [profileSaved, setProfileSaved] = useState(false);

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Handle profile update
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateProfile(profileForm).unwrap();

      // Update Redux auth state
      if (authUser) {
        dispatch(setCredentials({
          user: {
            ...authUser,
            name: result.data.name,
            email: result.data.email,
          },
          token: localStorage.getItem('token') || '',
        }));
        // Update localStorage user
        localStorage.setItem('user', JSON.stringify({
          ...authUser,
          name: result.data.name,
          email: result.data.email,
        }));
      }

      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
      toast.success('Profile updated successfully! ✅');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update profile');
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      toast.success('Password changed successfully! 🔒');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to change password');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            Manage your account information and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Profile Card ── */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700 text-center">
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700
                                  rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-4xl font-bold text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-green-500
                                  rounded-full border-2 border-white dark:border-slate-800
                                  flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {user.name}
              </h2>
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">
                {user.email}
              </p>

              {/* Role Badge */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400'
              }`}>
                <Shield className="w-3.5 h-3.5" />
                <span className="capitalize">{user.role}</span>
              </span>
            </div>

            {/* Account Info Card */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg
                                  flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Full Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg
                                  flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Email Address</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg
                                  flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Account Role</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {user.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/40 rounded-lg
                                  flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Member Since</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.createdAt
                        ? format(new Date(user.createdAt), 'MMM dd, yyyy')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Forms ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile Form */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-lg
                                flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Edit Profile
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Update your personal information
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="label dark:text-slate-300">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                    placeholder="Your full name"
                    required
                    minLength={2}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="label dark:text-slate-300">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="input dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Role (read-only) */}
                <div>
                  <label className="label dark:text-slate-300">Account Role</label>
                  <div className="input bg-gray-50 dark:bg-slate-700/50 dark:border-slate-600
                                  dark:text-slate-400 cursor-not-allowed flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="capitalize">{user.role}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">
                    Role cannot be changed
                  </p>
                </div>

                {/* Submit */}
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>

                  {profileSaved && (
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Saved!</span>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="card dark:bg-slate-800 dark:border dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-lg
                                flex items-center justify-center">
                  <Lock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Change Password
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Update your security credentials
                  </p>
                </div>
              </div>

              {/* Security Tips */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20
                              border border-blue-200 dark:border-blue-800 rounded-xl mb-5">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-medium mb-1">Password Requirements:</p>
                  <ul className="space-y-0.5 text-xs">
                    <li>• Minimum 6 characters</li>
                    <li>• Use a mix of letters and numbers</li>
                    <li>• Do not reuse recent passwords</li>
                  </ul>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                {/* Current Password */}
                <div>
                  <label className="label dark:text-slate-300">
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="input pr-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="label dark:text-slate-300">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="input pr-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password Strength Indicator */}
                  {passwordForm.newPassword && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              passwordForm.newPassword.length >= level * 3
                                ? level <= 1 ? 'bg-red-400'
                                  : level <= 2 ? 'bg-orange-400'
                                  : level <= 3 ? 'bg-yellow-400'
                                  : 'bg-green-400'
                                : 'bg-gray-200 dark:bg-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {passwordForm.newPassword.length < 4 ? 'Too weak' :
                         passwordForm.newPassword.length < 7 ? 'Weak' :
                         passwordForm.newPassword.length < 10 ? 'Medium' : 'Strong'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="label dark:text-slate-300">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className={`input pr-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 ${
                        passwordForm.confirmPassword &&
                        passwordForm.newPassword !== passwordForm.confirmPassword
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordForm.confirmPassword &&
                    passwordForm.newPassword !== passwordForm.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                  )}
                  {passwordForm.confirmPassword &&
                    passwordForm.newPassword === passwordForm.confirmPassword &&
                    passwordForm.newPassword.length >= 6 && (
                    <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Passwords match
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={
                    isChangingPassword ||
                    !passwordForm.currentPassword ||
                    !passwordForm.newPassword ||
                    !passwordForm.confirmPassword ||
                    passwordForm.newPassword !== passwordForm.confirmPassword
                  }
                  className="btn btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Change Password</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;