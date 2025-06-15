import React, { useState } from "react";
import "./style-adding.css";

function AddItem({ onClose, cartId, userId }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("");
  const [link, setLink] = useState("");
  const [imageURL, setImageURL] = useState("");

  const handleAddCart = async () => {
  try {
      const res = await fetch("http://localhost:5016/add_item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId, 
          cartId, 
          name, 
          description, 
          price: parseFloat(price) || 0, 
          currency, 
          link, 
          imageURL 
        }),
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        alert("Przedmiot został dodany do koszyka.");
        onClose();
        window.location.reload();
      } else {
        alert(data.message || "Błąd podczas dodawania przedmiotu");
      }
    } catch (error) {
      alert("Błąd sieci. Spróbuj ponownie.");
    }
  };

  // Styl dla inputów i textarea, ograniczający szerokość
  const inputStyle = {
    maxWidth: "350px",
    width: "100%",
    boxSizing: "border-box",
    marginLeft: "auto",
    marginRight: "auto",
    display: "block"
  };

  return (
    <div className="adding-overlay">
      <div className="adding">
        <h2 className="title">Dodaj nowy produkt do aktualnego koszyka</h2>
        <label className="input-label">
          Nazwa: (max 100 znaków)
          <input
            className="input"
            type="text"
            maxLength={100}
            value={name}
            onChange={e => setName(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label className="input-label">
          Opisz go: (max 200 znaków)
          <textarea
            className="textarea"
            maxLength={200}
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label className="input-label">
          Cena: (max 10 znaków)
          <input
            className="input"
            type="number"
            maxLength={10}
            value={price}
            onChange={e => setPrice(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label className="input-label">
          Waluta: (max 15 znaków)
          <input
            className="input"
            type="text"
            maxLength={15}
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label className="input-label">
          Link do przedmiotu w sklepie: (max 200 znaków)
          <input
            className="input"
            type="text"
            maxLength={200}
            value={link}
            onChange={e => setLink(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label className="input-label">
          Link do zdjęcia: (max 200 znaków)
          <input
            className="input"
            type="text"
            maxLength={200}
            value={imageURL}
            onChange={e => setImageURL(e.target.value)}
            style={inputStyle}
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
export default AddItem;