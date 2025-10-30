import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function OrdersManager() {

  const [orders, setOrders] = useState([]);
  const [searchParams, setSearchParms] = useSearchParams();
  const filterStatus = searchParams.get("status") || "All";

  const fetchOrders = async (status) => {
    let url = "http://localhost:8000/orders";
    if (status !== "All") {
      url += `?status=${status}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders(filterStatus);
  }, [filterStatus]);
    

  const updateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:8000/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
    fetchOrders(filterStatus) 
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const formatOrderDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const sendNotification = async (orderId) => {
    const botToken = "8108803422:AAFUNCw_y-_A5fsN0BYFZ9wh9E6cdo6TezU";
    const chatId = "1144612747";
  
    try {
      const res = await fetch(`http://localhost:8000/orders/${orderId}`);
      const order = await res.json();
  
      if (!order) {
        toast.error("Order not found");
        return;
      }
  
      const userName = order.userName || "Dear customer";
      const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = order.totalAmount?.toFixed(2) || "0.00";
  
      let statusMessage = "";
      switch (order.status) {
        case "Accepted":
          statusMessage = "✅ Your order is being prepared!";
          break;
        case "In Progress":
          statusMessage = "🚚 Your order is on the way!";
          break;
        case "Delivered":
          statusMessage = "📦 Your order has been delivered!";
          break;
        default:
          statusMessage = "ℹ️ Your order has been updated!";
      }
  
      const itemsList = order.items.map(item => { 
        return ` ${item.name} ×${item.quantity} $${(Number(item.price) * item.quantity).toFixed(2)}`;
      }).join('\n');
  
      
      const message = `
      🛒 Dear ${userName}!
      #️⃣ Order id: ${orderId}
      
      ${statusMessage}
      
      📦 Order list:
        ${itemsList}
      
      🛍️ Total itmes: ${itemCount} pieces
      💵 Total price: $${totalAmount}
      
      Thank you for choosing our service! 🙏
      `;
  
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message.trim())}`);
      toast.success("Notification sent successfully");
  
    } catch (error) {
      console.error("Notification sending error:", error);
      toast.error("Failed to send notification");
    }
  };


  return (
    <div className="order-management
    -dashboard" style={{
      width: "80%",
      margin: "0 auto",
      marginTop: "60px", 
    }}>
      <div className="dashboard-header">
        <h2 className="dashboard-title">Order Management</h2>

        <div className="status-filters">
          {["All", "Accepted", "In Progress", "Delivered"].map((status) => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? "active" : ""}`}
              onClickCapture={() => setSearchParms({status: status})}
            >
              {status}  
            </button>
          ))}
        </div>
      </div>

      <div className="orders-grid">
        {orders.length === 0 ? (
          <p>No orders found for: {filterStatus}</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className={`order-card status-${order.status.toLowerCase().replace(" ", "-")}`}>
              <div className="order-header">
                <span className="order-id">Order #{order.id}</span>
                <span className="order-date">{formatOrderDate(order.createdAt)}</span>
              </div>

              <div className="order-user">
                <span className="user-icon">👤</span>
                <span className="user-id">User: {order.userName}</span>
              </div>

              <div className="order-details">
                <div className="detail-item">
                  <span className="detail-label">Items:</span>
                  <span className="detail-value">{order.items.length}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Total:</span>
                  <span className="detail-value price">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="status-control">
                <label className="status-label">Status:</label>
                <div className="custom-select">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`status-select ${order.status.toLowerCase().replace(" ", "-")}`}
                  >
                    <option value="Accepted">Accepted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>

              <div className="order-footer">
                <button className="action-btn details-btn">View Details</button>
                <button className="action-btn notify-btn"
                onClick={() => sendNotification(order.id)}
                >Notify User
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

