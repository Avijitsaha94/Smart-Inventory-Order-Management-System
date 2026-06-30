/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Order, OrdersResponse, CreateOrderData } from '../../types';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    // Get all orders with filters
    getOrders: builder.query<
      OrdersResponse,
      {
        page?: number;
        limit?: number;
        status?: string;
        startDate?: string;
        endDate?: string;
        sort?: string;
      }
    >({
      query: (params) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Orders'],
    }),

    // Get single order
    getOrder: builder.query<{ success: boolean; data: Order }, string>({
      query: (id) => `/orders/${id}`,
      providesTags: ['Orders'],
    }),

    // Create order
    createOrder: builder.mutation<
      { success: boolean; data: Order },
      CreateOrderData
    >({
      query: (data) => ({
        url: '/orders',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Orders'],
    }),

    // Update order status (Admin only)
    updateOrderStatus: builder.mutation<
      { success: boolean; data: Order },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Orders'],
    }),

    // Cancel order
    cancelOrder: builder.mutation<
      { success: boolean; message: string; data: Order },
      string
    >({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Orders'],
    }),

    // Get order statistics (Admin only)
    getOrderStats: builder.query<
      {
        success: boolean;
        data: {
          totalOrders: number;
          pendingOrders: number;
          processingOrders: number;
          completedOrders: number;
          totalRevenue: number;
          monthlyRevenue: any[];
        };
      },
      void
    >({
      query: () => '/orders/stats/summary',
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useGetOrderStatsQuery,
} = orderApi;