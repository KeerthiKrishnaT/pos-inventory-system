import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    seller: '',
    product: '',
    minAmount: '',
    maxAmount: ''
  });

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sales, filters]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/sales`);
      setSales(response.data);
    } catch (error) {
      console.error('Failed to load sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const applyFilters = () => {
    let filtered = [...sales];

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(sale => new Date(sale.createdAt) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Include entire day
      filtered = filtered.filter(sale => new Date(sale.createdAt) <= toDate);
    }

    // Seller filter
    if (filters.seller) {
      filtered = filtered.filter(sale => 
        (sale.soldByName || sale.soldBy?.email || '').toLowerCase().includes(filters.seller.toLowerCase())
      );
    }

    // Product filter
    if (filters.product) {
      filtered = filtered.filter(sale =>
        sale.items.some(item => 
          item.productName.toLowerCase().includes(filters.product.toLowerCase())
        )
      );
    }

    // Amount range filter
    if (filters.minAmount) {
      filtered = filtered.filter(sale => sale.totalAmount >= parseFloat(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(sale => sale.totalAmount <= parseFloat(filters.maxAmount));
    }

    setFilteredSales(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      seller: '',
      product: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  const getUniqueSellers = () => {
    const sellers = new Set();
    sales.forEach(sale => {
      const seller = sale.soldByName || sale.soldBy?.email || 'N/A';
      if (seller !== 'N/A') sellers.add(seller);
    });
    return Array.from(sellers).sort();
  };

  const getUniqueProducts = () => {
    const products = new Set();
    sales.forEach(sale => {
      sale.items.forEach(item => products.add(item.productName));
    });
    return Array.from(products).sort();
  };

  const handlePrint = (sale) => {
    if (!sale) return;

    const printWindow = window.open('', '', 'width=900,height=700');
    const date = formatDate(sale.createdAt);
    const itemsRows = sale.items.map((item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.productName}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price.toFixed(2)}</td>
        <td>₹${item.subtotal.toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Sale Receipt</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
            * { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
            body {
              margin: 0;
              padding: 30px;
              background: #0f0c29;
              background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
              color: #333;
            }
            .print-card {
              background: rgba(255, 255, 255, 0.97);
              border-radius: 20px;
              max-width: 800px;
              margin: 0 auto;
              padding: 35px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
            }
            .print-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #eef2ff;
              padding-bottom: 20px;
            }
            .brand {
              font-size: 26px;
              font-weight: 600;
              color: #2d2f90;
            }
            .badge {
              padding: 8px 18px;
              border-radius: 999px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              font-size: 12px;
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            .details-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin-bottom: 25px;
            }
            .detail-block {
              background: #f8f9ff;
              border-radius: 12px;
              padding: 15px;
              border: 1px solid #eef2ff;
            }
            .detail-title {
              font-size: 12px;
              text-transform: uppercase;
              color: #7c8db5;
              margin-bottom: 5px;
              letter-spacing: 1px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
            }
            th, td {
              padding: 12px;
              text-align: left;
            }
            thead {
              background: #f5f6ff;
            }
            tbody tr:nth-child(even) {
              background: #fff;
            }
            tbody tr:nth-child(odd) {
              background: #fafaff;
            }
            tfoot {
              background: #f5f6ff;
            }
            .total-row {
              font-size: 20px;
              font-weight: 600;
            }
            .footer {
              text-align: center;
              font-size: 13px;
              color: #7c8db5;
              border-top: 1px solid #eef2ff;
              padding-top: 15px;
            }
            @media print {
              body { padding: 0; }
              .print-card { box-shadow: none; border-radius: 0; }
            }
          </style>
        </head>
        <body>
          <div class="print-card">
            <div class="print-header">
              <div>
                <div class="brand">POS & Inventory System</div>
                <div style="color:#7c8db5;">Sale Receipt</div>
              </div>
              <div class="badge">Sale Summary</div>
            </div>
            <div class="details-grid">
              <div class="detail-block">
                <div class="detail-title">Sale ID</div>
                <div>${sale._id}</div>
              </div>
              <div class="detail-block">
                <div class="detail-title">Date & Time</div>
                <div>${date}</div>
              </div>
              <div class="detail-block">
                <div class="detail-title">Processed By</div>
                <div>${sale.soldByName || sale.soldBy?.email || 'N/A'}</div>
              </div>
              <div class="detail-block">
                <div class="detail-title">Items Count</div>
                <div>${sale.items.length} item(s)</div>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
            <table>
              <tfoot>
                <tr class="total-row">
                  <td colspan="4" style="text-align:right;">Grand Total</td>
                  <td>₹${sale.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            <div class="footer">
              Thank you for using the POS & Inventory System · Generated on ${new Date().toLocaleString()}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  const hasActiveFilters = Object.values(filters).some(val => val !== '');

  return (
    <div>
      <div className="page-header">
        <h2>Sales History</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowFilters(!showFilters)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>🔍</span>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && <span className="filter-badge">{Object.values(filters).filter(v => v !== '').length}</span>}
        </button>
      </div>

      {showFilters && (
        <div className="card filter-panel">
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Filter Sales</h3>
          <div className="filter-grid">
            <div className="form-group">
              <label>Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Seller</label>
              <select
                value={filters.seller}
                onChange={(e) => handleFilterChange('seller', e.target.value)}
                className="form-control"
              >
                <option value="">All Sellers</option>
                {getUniqueSellers().map(seller => (
                  <option key={seller} value={seller}>{seller}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Product</label>
              <select
                value={filters.product}
                onChange={(e) => handleFilterChange('product', e.target.value)}
                className="form-control"
              >
                <option value="">All Products</option>
                {getUniqueProducts().map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Min Amount (₹)</label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                className="form-control"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Max Amount (₹)</label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                className="form-control"
                placeholder="No limit"
                min="0"
                step="0.01"
              />
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
        <p>Loading sales...</p>
      ) : (
        <div className="card">
          {filteredSales.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No sales recorded yet.
            </p>
          ) : (
            <div className="responsive-table-wrapper">
              <table className="table sales-history-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Sold By</th>
                  <th>Items</th>
                  <th>Products</th>
                    <th>Total Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale._id}>
                      <td data-label="Date & Time">{formatDate(sale.createdAt)}</td>
                      <td data-label="Sold By">{sale.soldByName || sale.soldBy?.email || 'N/A'}</td>
                      <td data-label="Items">{sale.items.length} item(s)</td>
                      <td data-label="Products">
                        {sale.items.map((item, idx) => (
                          <div key={idx}>
                            {item.productName} ({item.quantity} × ₹{item.price.toFixed(2)})
                          </div>
                        ))}
                      </td>
                      <td data-label="Total Amount">₹{sale.totalAmount.toFixed(2)}</td>
                      <td data-label="Action">
                        <button
                          className="btn btn-primary"
                          onClick={() => setSelectedSale(sale)}
                          style={{ fontSize: '12px', padding: '5px 10px' }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedSale && (
        <div 
          className="modal" 
          onClick={() => setSelectedSale(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sale-details-title"
          aria-describedby="sale-details-description"
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()} id="sale-details-description">
            <div className="modal-header">
              <h3 id="sale-details-title">Sale Details</h3>
              <button 
                className="close-btn" 
                onClick={() => setSelectedSale(null)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Date:</strong> {formatDate(selectedSale.createdAt)}
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>Sold By:</strong> {selectedSale.soldByName || selectedSale.soldBy?.email || 'N/A'}
            </div>

            <table className="table" style={{ marginBottom: '15px' }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedSale.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>₹{item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px', textAlign: 'right' }}>
              <strong style={{ fontSize: '18px' }}>Total: ₹{selectedSale.totalAmount.toFixed(2)}</strong>
            </div>

            <div className="form-actions" style={{ justifyContent: 'space-between' }}>
              <button className="btn btn-primary" onClick={() => handlePrint(selectedSale)}>
                Print Details
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedSale(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;

