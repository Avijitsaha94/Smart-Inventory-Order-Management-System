import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, ProductsResponse, ProductFormData } from '../../types';

export const productApi = createApi({
  reducerPath: 'productApi',
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
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    // Get all products with filters
    getProducts: builder.query<
      ProductsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        stockStatus?: string;
      }
    >({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Products'],
    }),

    // Get single product
    getProduct: builder.query<{ success: boolean; data: Product }, string>({
      query: (id) => `/products/${id}`,
      providesTags: ['Products'],
    }),

    // Create product (Admin only)
    createProduct: builder.mutation<
      { success: boolean; data: Product },
      ProductFormData
    >({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),

    // Update product (Admin only)
    updateProduct: builder.mutation<
      { success: boolean; data: Product },
      { id: string; data: Partial<ProductFormData> }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),

    // Delete product (Admin only)
    deleteProduct: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),

    // Update stock
    updateStock: builder.mutation<
      { success: boolean; data: Product },
      { id: string; quantity: number; action: 'add' | 'subtract' }
    >({
      query: ({ id, quantity, action }) => ({
        url: `/products/${id}/stock`,
        method: 'PATCH',
        body: { quantity, action },
      }),
      invalidatesTags: ['Products'],
    }),

    // Get low stock products
    getLowStockProducts: builder.query<
      { success: boolean; count: number; data: Product[] },
      void
    >({
      query: () => '/products/alerts/low-stock',
      providesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateStockMutation,
  useGetLowStockProductsQuery,
} = productApi;