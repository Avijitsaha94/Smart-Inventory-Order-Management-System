/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetProductQuery,
} from '../../redux/api/productApi';
import type { ProductFormData } from '../../types';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Electronics','Clothing','Food','Books',
  'Furniture','Toys','Sports','Others',
];

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { data: productData } = useGetProductQuery(id!, { skip: !id });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: 'Electronics',
    stock: 0,
    sku: '',
    lowStockThreshold: 10,
  });

  useEffect(() => {
    if (productData?.data && !isDataLoaded) {
      const p = productData.data;
      setFormData({
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        stock: p.stock,
        sku: p.sku,
        lowStockThreshold: p.lowStockThreshold,
      });
      setIsDataLoaded(true);
    }
  }, [productData, isDataLoaded]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && id) {
        await updateProduct({ id, data: formData }).unwrap();
        toast.success('Product updated successfully! ✅');
      } else {
        await createProduct(formData).unwrap();
        toast.success('Product created successfully! 🎉');
      }
      navigate('/products');
    } catch (error: any) {
      toast.error(error.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
    }
  };

  const isLoading = isCreating || isUpdating;

  const inputClass = 'input dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400';
  const labelClass = 'label dark:text-slate-300';

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-gray-600 dark:text-slate-400
                       hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </button>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">
            {isEditMode ? 'Update product information' : 'Fill in the details to add a new product'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}
          className="card dark:bg-slate-800 dark:border dark:border-slate-700">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className={labelClass}>
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text" name="name" value={formData.name}
                onChange={handleChange} className={inputClass}
                placeholder="e.g., iPhone 15 Pro" required minLength={2}
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description" value={formData.description}
                onChange={handleChange}
                className={`${inputClass} min-h-[100px] resize-y`}
                placeholder="Detailed product description..." required minLength={10}
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  Price (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" name="price" value={formData.price}
                  onChange={handleChange} className={inputClass}
                  placeholder="0" required min={0} step={0.01}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" name="stock" value={formData.stock}
                  onChange={handleChange} className={inputClass}
                  placeholder="0" required min={0}
                />
              </div>
            </div>

            {/* Category & SKU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category" value={formData.category}
                  onChange={handleChange} className={inputClass} required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="sku" value={formData.sku}
                  onChange={handleChange} className={`${inputClass} ${isEditMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                  placeholder="e.g., IPHONE-15-PRO-001"
                  required disabled={isEditMode}
                />
                {isEditMode && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">SKU cannot be changed</p>
                )}
              </div>
            </div>

            {/* Low Stock Threshold */}
            <div>
              <label className={labelClass}>Low Stock Threshold</label>
              <input
                type="number" name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange} className={inputClass}
                placeholder="10" min={0}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">
                You'll be alerted when stock falls below this number
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-slate-700" />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit" disabled={isLoading}
                className="flex-1 btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{isEditMode ? 'Update Product' : 'Create Product'}</span>
                  </>
                )}
              </button>
              <button
                type="button" onClick={() => navigate('/products')}
                className="btn btn-secondary dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default ProductForm;