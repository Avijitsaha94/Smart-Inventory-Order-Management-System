import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from '../../types';

interface UsersResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: User[];
}

interface UserStatsResponse {
  success: boolean;
  data: {
    totalUsers: number;
    adminCount: number;
    userCount: number;
    newThisMonth: number;
  };
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
      sort?: string;
    }>({
      query: (params) => ({ url: '/users', params }),
      providesTags: ['Users'],
    }),

    getUserStats: builder.query<UserStatsResponse, void>({
      query: () => '/users/stats',
      providesTags: ['Users'],
    }),

    updateUserRole: builder.mutation<{ success: boolean; data: User }, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['Users'],
    }),

    deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserStatsQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = userApi;