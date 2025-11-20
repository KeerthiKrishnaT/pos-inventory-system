import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EmployeePOS = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [lastSale, setLastSale] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/sales/pos/products`);
      setProducts(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load products' });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product._id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        setMessage({ type: 'error', text: `Only ${product.stock} units available` });
        return;
      }
      setCart(cart.map(item =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (product.stock === 0) {
        setMessage({ type: 'error', text: 'Product out of stock' });
        return;
      }
      setCart([...cart, {
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock
      }]);
    }
    setMessage({ type: 'success', text: 'Item added to cart' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const updateQuantity = (productId, newQuantity) => {
    const cartItem = cart.find(item => item.productId === productId);
    if (newQuantity > cartItem.stock) {
      setMessage({ type: 'error', text: `Only ${cartItem.stock} units available` });
      return;
    }
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Cart is empty' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const items = cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      const response = await axios.post(`${API_URL}/sales`, { items });
      const saleData = response.data;
      
      setLastSale({
        date: new Date(saleData.createdAt).toLocaleString(),
        items: saleData.items,
        totalAmount: saleData.totalAmount,
        soldBy: saleData.soldByName || user?.email
      });
      
      setMessage({ type: 'success', text: 'Sale completed successfully!' });
      setCart([]);
      fetchProducts();
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to complete sale'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handlePrintReceipt = () => {
    if (!lastSale) return;

    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sale Receipt</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .receipt-header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .receipt-header h1 {
              font-size: 28px;
              margin-bottom: 10px;
              color: #2c3e50;
            }
            .receipt-info {
              margin-bottom: 25px;
            }
            .receipt-info p {
              margin: 8px 0;
              font-size: 14px;
            }
            .receipt-info strong {
              display: inline-block;
              width: 120px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #2c3e50;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .total-section {
              margin-top: 20px;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 5px;
              text-align: right;
            }
            .total-section strong {
              font-size: 20px;
              color: #2c3e50;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            @media print {
              body {
                padding: 10px;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-header">
            <h1>Sale Receipt</h1>
          </div>
          
          <div class="receipt-info">
            <p><strong>Date/Time:</strong> ${lastSale.date}</p>
            <p><strong>Sold By:</strong> ${lastSale.soldBy}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${lastSale.items.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.price.toFixed(2)}</td>
                  <td>₹${item.subtotal.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <strong>Total Amount: ₹${lastSale.totalAmount.toFixed(2)}</strong>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>POS Counter</h1>
        <div className="navbar-actions">
          <span>Welcome, {user?.email}</span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        {message.text && (
          <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
            {message.text}
          </div>
        )}

        {lastSale && (
          <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f8f9fa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Last Sale Receipt</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handlePrintReceipt}
                  style={{ fontSize: '12px', padding: '5px 10px' }}
                >
                  Print Receipt
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setLastSale(null)}
                  style={{ fontSize: '12px', padding: '5px 10px' }}
                >
                  Close
                </button>
              </div>
            </div>
            <table className="table" style={{ marginBottom: '15px' }}>
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>Sold By</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{lastSale.date}</td>
                  <td>{lastSale.soldBy}</td>
                </tr>
              </tbody>
            </table>
            <table className="table" style={{ marginBottom: '15px' }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {lastSale.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                    <td>₹{item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '10px', backgroundColor: '#e9ecef', borderRadius: '4px', textAlign: 'right' }}>
              <strong>Total Amount: ₹{lastSale.totalAmount.toFixed(2)}</strong>
            </div>
          </div>
        )}

        <div className="pos-grid">
          <div className="card">
            <h2 style={{ marginBottom: '15px' }}>Products</h2>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: '15px' }}
              />
            </div>

            <div className="pos-products-table-wrapper" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Action</th>
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
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          style={{ fontSize: '12px', padding: '5px 10px' }}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: '15px' }}>Cart</h2>
            
            {cart.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                Cart is empty
              </p>
            ) : (
              <>
                <div className="pos-cart-table-wrapper">
                  <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.productId}>
                        <td>{item.productName}</td>
                        <td>₹{item.price.toFixed(2)}</td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            max={item.stock}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                            style={{ width: '60px', padding: '5px' }}
                          />
                        </td>
                        <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button
                            className="btn btn-danger remove-btn"
                            onClick={() => removeFromCart(item.productId)}
                            style={{ fontSize: '12px', padding: '5px 5px' }}
                            aria-label="Remove item"
                          >
                            <span className="remove-text">Remove</span>
                            <span className="remove-icon" aria-hidden="true">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 448 512"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M135.2 17.7C140.6 7.4 150.8 0 162.5 0h123.1c11.7 0 21.9 7.4 27.3 17.7L328 32H432c8.8 0 16 7.2 16 16s-7.2 16-16 16H16C7.2 64 0 56.8 0 48s7.2-16 16-16H120l15.2-14.3zM32 96H416l-21.2 369.9c-1.8 31.7-28 56.1-59.8 56.1H113.1c-31.8 0-58-24.4-59.8-56.1L32 96zm112 80c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V192c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V192c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V192c0-8.8-7.2-16-16-16z"/>
                              </svg>
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>

                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                    <span>Total:</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="btn btn-success"
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0}
                  style={{ width: '100%', marginTop: '15px', padding: '12px' }}
                >
                  {loading ? 'Processing...' : 'Complete Sale'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePOS;

