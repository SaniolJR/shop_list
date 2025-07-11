import React, { useState } from "react";
import "./style-adding.css";

function AddCart({ onClose }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const handleAddCart = async () => {
  const res = await fetch("http://localhost:5016/me", { credentials: "include" });
  const data = await res.json();
  const userId = data.userId;

  const response = await fetch("http://localhost:5016/add_cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, name, description: desc }),
  });
  
  if (response.ok) {
    onClose();
    window.location.reload();
  }
};

  return (
    <div className="adding-overlay">
      <div className="adding">
        <h2 className="title">Dodaj nowy folder</h2>
        <label className="input-label">
          Nazwa: (max 30 znaków)
          <input
            className="input"
            type="text"
            maxLength={30}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>
        <label className="input-label">
          Opisz: (max 200 znaków)
          <textarea
            className="textarea"
            maxLength={200}
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
        </label>
        <div className="adding-button-row">
          <button className="adding-button" onClick={onClose}>Anuluj</button>
          <button className="adding-button" onClick={handleAddCart}>Dodaj</button>
        </div>
      </div>
    </div>
  );
}
export default AddCart;