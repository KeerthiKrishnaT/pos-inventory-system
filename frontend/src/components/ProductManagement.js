import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stock: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
    stockStatus: '' 
    
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        sku: product.sku,
        price: product.price.toString(),
        stock: product.stock.toString()
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', sku: '', price: '', stock: '' });
    }
    setShowModal(true);
    setMessage({ type: '', text: '' });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({ name: '', sku: '', price: '', stock: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editingProduct) {
        await axios.put(`${API_URL}/products/${editingProduct._id}`, formData);
        setMessage({ type: 'success', text: 'Product updated successfully' });
      } else {
        await axios.post(`${API_URL}/products`, formData);
        setMessage({ type: 'success', text: 'Product created successfully' });
      }
      fetchProducts();
      // Close modal after 1 second
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
      // Show success message for 20 seconds (even after modal closes)
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 20000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Operation failed'
      });
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter (name or SKU)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower)
      );
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
    }

    // Stock range filter
    if (filters.minStock) {
      filtered = filtered.filter(product => product.stock >= parseInt(filters.minStock));
    }
    if (filters.maxStock) {
      filtered = filtered.filter(product => product.stock <= parseInt(filters.maxStock));
    }

    // Stock status filter
    if (filters.stockStatus) {
      if (filters.stockStatus === 'out_of_stock') {
        filtered = filtered.filter(product => product.stock === 0);
      } else if (filters.stockStatus === 'low_stock') {
        filtered = filtered.filter(product => product.stock > 0 && product.stock <= 10);
      } else if (filters.stockStatus === 'in_stock') {
        filtered = filtered.filter(product => product.stock > 10);
      }
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      maxStock: '',
      stockStatus: ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/products/${id}`);
      setMessage({ type: 'success', text: 'Product deleted successfully' });
      fetchProducts();
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 20000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete product'
      });
    }
  };

  const hasActiveFilters = Object.values(filters).some(val => val !== '');

  return (
    <div>
      <div className="page-header">
        <h2>Product Management</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={() => setShowFilters(!showFilters)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span>🔍</span>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && <span className="filter-badge">{Object.values(filters).filter(v => v !== '').length}</span>}
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            Add New Product
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {message.text}
        </div>
      )}

      {showFilters && (
        <div className="card filter-panel">
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Filter Products</h3>
          <div className="filter-grid">
            <div className="form-group">
              <label>Search (Name or SKU)</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="form-control"
                placeholder="Search products..."
              />
            </div>
            <div className="form-group">
              <label>Min Price (₹)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="form-control"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Max Price (₹)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="form-control"
                placeholder="No limit"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Min Stock</label>
              <input
                type="number"
                value={filters.minStock}
                onChange={(e) => handleFilterChange('minStock', e.target.value)}
                className="form-control"
                placeholder="0"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Max Stock</label>
              <input
                type="number"
                value={filters.maxStock}
                onChange={(e) => handleFilterChange('maxStock', e.target.value)}
                className="form-control"
                placeholder="No limit"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Stock Status</label>
              <select
                value={filters.stockStatus}
                onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
                className="form-control"
              >
                <option value="">All</option>
                <option value="in_stock">In Stock (&gt;10)</option>
                <option value="low_stock">Low Stock (1-10)</option>
                <option value="out_of_stock">Out of Stock (0)</option>
              </select>
            </div>
          </div>
          {hasActiveFilters && (
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="card">
          {filteredProducts.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              {products.length === 0 ? 'No products found. Add your first product!' : 'No products match the selected filters.'}
            </p>
          ) : (
            <>
              <div style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
                Showing {filteredProducts.length} of {products.length} products
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>₹{product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleOpenModal(product)}
                        style={{ marginRight: '5px', fontSize: '12px', padding: '5px 10px' }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(product._id)}
                        style={{ fontSize: '12px', padding: '5px 10px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>

            {message.text && (
              <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>SKU/Code *</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                  required
                  disabled={!!editingProduct}
                />
              </div>

              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Initial Stock *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

