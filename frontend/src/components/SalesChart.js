import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const SalesChart = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productSales, setProductSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get(`${API_URL}/sales`);
      setSales(response.data);
      calculateProductSales(response.data);
    } catch (error) {
      console.error('Failed to load sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProductSales = (salesData) => {
    const productMap = {};
    
    salesData.forEach(sale => {
      sale.items.forEach(item => {
        const productName = item.productName;
        if (productMap[productName]) {
          productMap[productName].quantity += item.quantity;
          productMap[productName].revenue += item.subtotal;
        } else {
          productMap[productName] = {
            name: productName,
            quantity: item.quantity,
            revenue: item.subtotal
          };
        }
      });
    });

    const products = Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6); // Top 6 products

    setProductSales(products);
  };

  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe', 
    '#43cea2', '#ffd200', '#ff7e00', '#ff5f6d'
  ];

  const totalRevenue = productSales.reduce((sum, p) => sum + p.revenue, 0);

  const calculatePieData = () => {
    let currentAngle = -90; // Start from top
    const segments = [];

    productSales.forEach((product, index) => {
      const percentage = (product.revenue / totalRevenue) * 100;
      const angle = (percentage / 100) * 360;
      
      segments.push({
        ...product,
        percentage: percentage.toFixed(1),
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: colors[index % colors.length]
      });

      currentAngle += angle;
    });

    return segments;
  };

  const pieData = calculatePieData();

  const getPathData = (startAngle, endAngle, radius = 80) => {
    const start = polarToCartesian(radius, startAngle);
    const end = polarToCartesian(radius, endAngle);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${radius} ${radius}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: radius + (radius * Math.cos(angleInRadians)),
      y: radius + (radius * Math.sin(angleInRadians))
    };
  };

  if (loading) {
    return <div className="chart-card">Loading chart data...</div>;
  }

  if (productSales.length === 0) {
    return (
      <div className="chart-card">
        <h3>Product Sales Chart</h3>
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No sales data available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>Product Sales Overview</h3>
      <div className="chart-container">
        <div className="pie-chart-wrapper">
          <svg viewBox="0 0 200 200" className="pie-chart">
            {pieData.map((segment, index) => (
              <path
                key={index}
                d={getPathData(segment.startAngle, segment.endAngle)}
                fill={segment.color}
                stroke="#fff"
                strokeWidth="2"
                className="pie-segment"
              />
            ))}
            <circle cx="100" cy="100" r="50" fill="#fff" />
            <text x="100" y="95" textAnchor="middle" className="chart-center-text">
              Total
            </text>
            <text x="100" y="110" textAnchor="middle" className="chart-center-amount">
              ₹{totalRevenue.toFixed(2)}
            </text>
          </svg>
        </div>
        
        <div className="chart-legend">
          {pieData.map((item, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="legend-details">
                <span className="legend-name">{item.name}</span>
                <span className="legend-stats">
                  {item.quantity} sold · ₹{item.revenue.toFixed(2)} ({item.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;

