import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from '../../types';

interface UpdateProfileData {
  name?: string;
  email?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface ProfileResponse {
  success: boolean;
  data: User;
}

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<ProfileResponse, void>({
      query: () => '/auth/me',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<ProfileResponse, UpdateProfileData>({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Profile'],
    }),
    changePassword: builder.mutation<{ success: boolean; message: string }, ChangePasswordData>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = profileApi;