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

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // API calls
  const { data: productData } = useGetProductQuery(id!, { skip: !id });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: 'Electronics',
    stock: 0,
    sku: '',
    lowStockThreshold: 10,
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Categories
  const categories = [
    'Electronics',
    'Clothing',
    'Food',
    'Books',
    'Furniture',
    'Toys',
    'Sports',
    'Others',
  ];

  // Load product data for edit mode - FIX: Added proper dependency
  useEffect(() => {
    if (productData?.data && !isDataLoaded) {
      const product = productData.data;
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        sku: product.sku,
        lowStockThreshold: product.lowStockThreshold,
      });
      setIsDataLoaded(true);
    }
  }, [productData, isDataLoaded]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value,
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
      const errorMessage =
        error.data?.message ||
        `Failed to ${isEditMode ? 'update' : 'create'} product`;
      toast.error(errorMessage);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Products</span>
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? 'Update product information'
              : 'Fill in the details to add a new product'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card">
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="label">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="e.g., iPhone 15 Pro"
                required
                minLength={2}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input min-h-[100px] resize-y"
                placeholder="Detailed product description..."
                required
                minLength={10}
              />
            </div>

            {/* Price & Stock Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label htmlFor="price" className="label">
                  Price (৳) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="input"
                  placeholder="0"
                  required
                  min={0}
                  step={0.01}
                />
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock" className="label">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="input"
                  placeholder="0"
                  required
                  min={0}
                />
              </div>
            </div>

            {/* Category & SKU Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="label">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* SKU */}
              <div>
                <label htmlFor="sku" className="label">
                  SKU <span className="text-red-500">*</span>
                </label>
                <input
                  id="sku"
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="input"
                  placeholder="e.g., IPHONE-15-PRO-001"
                  required
                  disabled={isEditMode}
                />
                {isEditMode && (
                  <p className="mt-1 text-xs text-gray-500">
                    SKU cannot be changed
                  </p>
                )}
              </div>
            </div>

            {/* Low Stock Threshold */}
            <div>
              <label htmlFor="lowStockThreshold" className="label">
                Low Stock Threshold
              </label>
              <input
                id="lowStockThreshold"
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                className="input"
                placeholder="10"
                min={0}
              />
              <p className="mt-1 text-xs text-gray-500">
                You'll be alerted when stock falls below this number
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>
                      {isEditMode ? 'Update Product' : 'Create Product'}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/products')}
                className="btn btn-secondary"
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