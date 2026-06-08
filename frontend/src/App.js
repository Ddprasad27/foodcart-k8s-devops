import React, { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL || "http://52.226.194.79:5000";

export default function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("menu");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API}/api/menu`)
      .then(r => r.json())
      .then(setMenu);
  }, []);

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const placeOrder = async () => {
    const res = await fetch(`${API}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, total })
    });
    const data = await res.json();
    setMessage(`Order confirmed! ID: ${data.orderId.slice(-6).toUpperCase()}`);
    setCart([]);
    setTimeout(() => setMessage(""), 4000);
  };

  const viewOrders = () => {
    fetch(`${API}/api/orders`)
      .then(r => r.json())
      .then(data => { setOrders(data); setView("orders"); });
  };

  return (
    <div style={{ fontFamily: "Arial", maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <div style={{ background: "#FF6B35", color: "white", padding: "20px 30px", borderRadius: 12, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32 }}>FoodCart</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>Order fresh food online</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setView("menu")} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: view === "menu" ? "white" : "rgba(255,255,255,0.3)", color: view === "menu" ? "#FF6B35" : "white", cursor: "pointer", fontWeight: "bold" }}>Menu</button>
          <button onClick={() => setView("cart")} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: view === "cart" ? "white" : "rgba(255,255,255,0.3)", color: view === "cart" ? "#FF6B35" : "white", cursor: "pointer", fontWeight: "bold" }}>Cart ({cart.length})</button>
          <button onClick={viewOrders} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: view === "orders" ? "white" : "rgba(255,255,255,0.3)", color: view === "orders" ? "#FF6B35" : "white", cursor: "pointer", fontWeight: "bold" }}>Orders</button>
        </div>
      </div>
      {message && <div style={{ background: "#4CAF50", color: "white", padding: "16px 24px", borderRadius: 8, marginBottom: 20, fontSize: 18, textAlign: "center", fontWeight: "bold" }}>{message}</div>}
      {view === "menu" && (
        <div>
          <h2 style={{ color: "#333" }}>Our Menu</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {menu.map(item => (
              <div key={item.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 20, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: 48 }}>{item.emoji}</div>
                <h3 style={{ margin: "8px 0 4px", color: "#333" }}>{item.name}</h3>
                <p style={{ color: "#888", margin: "0 0 8px", fontSize: 13 }}>{item.category}</p>
                <p style={{ color: "#FF6B35", fontWeight: "bold", fontSize: 18, margin: "0 0 12px" }}>Rs. {item.price}</p>
                <button onClick={() => addToCart(item)} style={{ background: "#FF6B35", color: "white", border: "none", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontWeight: "bold", width: "100%" }}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {view === "cart" && (
        <div>
          <h2 style={{ color: "#333" }}>Your Cart</h2>
          {cart.length === 0 ? <p style={{ color: "#888", fontSize: 18 }}>Cart is empty!</p> : (
            <div>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", border: "1px solid #eee", borderRadius: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 24 }}>{item.emoji}</span>
                  <span style={{ flex: 1, marginLeft: 12, fontWeight: "bold" }}>{item.name}</span>
                  <span style={{ color: "#888" }}>x{item.qty}</span>
                  <span style={{ color: "#FF6B35", fontWeight: "bold", marginLeft: 20 }}>Rs. {item.price * item.qty}</span>
                </div>
              ))}
              <div style={{ borderTop: "2px solid #FF6B35", paddingTop: 16, marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 20, fontWeight: "bold" }}>Total: Rs. {total}</span>
                <button onClick={placeOrder} style={{ background: "#FF6B35", color: "white", border: "none", padding: "14px 32px", borderRadius: 8, cursor: "pointer", fontWeight: "bold", fontSize: 16 }}>Place Order</button>
              </div>
            </div>
          )}
        </div>
      )}
      {view === "orders" && (
        <div>
          <h2 style={{ color: "#333" }}>Order History</h2>
          {orders.length === 0 ? <p style={{ color: "#888" }}>No orders yet.</p> : orders.map((o, i) => (
            <div key={i} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "bold" }}>Order {i + 1}</span>
                <span style={{ background: "#4CAF50", color: "white", padding: "2px 12px", borderRadius: 12, fontSize: 13 }}>{o.status}</span>
              </div>
              <p style={{ color: "#666", margin: "8px 0 0" }}>Total: Rs. {o.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
