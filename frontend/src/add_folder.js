import React, { useState } from "react";
import "./style-adding.css";

// komponent do dodawania folderu (czyli koszyka)
function AddFolder({ onClose }) {
  // tu trzymamy co wpisujesz w polu "Nazwa"
  const [name, setName] = useState("");
  // tu trzymamy co wpisujesz w polu "Opisz"
  const [desc, setDesc] = useState("");

  // funkcja wywoływana jak klikniesz "Dodaj"
  const handleAddFolder = async () => {
    // request do backendu, wrzuca to co wpisałeś do bazy
    await fetch("http://localhost:5016/add_cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, name, description: desc }), // userId, name, description
    });
    // zamykamy okno po dodaniu
    onClose();
  };

  return (
    <div className="adding">
      <h2 className="title">Dodaj nowy folder</h2>
      <label className="input-label">
        Nazwa: (max 30 znaków)
        <input
          className="input"
          type="text"
          maxLength={30} // nie pozwala wpisać więcej niż 30 znaków
          value={name} // przechowywanie wpisu przez useState do name
          onChange={e => setName(e.target.value)} // jak coś wpiszesz, to się zapisuje do state
        />
      </label>
      {/* Pole do wpisania opisu folderu */}
      <label className="input-label">
        Opisz: (max 200 znaków)
        <textarea
          className="textarea"
          maxLength={200} // max 200 znaków
          value={desc} // przechowywanie wpisu przez useState do desc
          onChange={e => setDesc(e.target.value)} // zapisuje do state
        />
      </label>
      {/* dwa przyciski na dole, rozciągnięte od lewej do prawej */}
      <div className="button-row">
        <button className="button" onClick={handleAddFolder}>Dodaj</button>
        <button className="button" onClick={onClose}>Anuluj</button>
      </div>
    </div>
  );
}
export default AddFolder;