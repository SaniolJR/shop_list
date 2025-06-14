import React from "react";

function AddFolder({ onClose }) {
  const handleAddFolder = () => {
    // Logika dodawania folderu
    console.log("Dodano folder");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        zIndex: 1001,
      }}
    >
      <h2>Dodaj nowy folder</h2>
      <button onClick={handleAddFolder}>Dodaj</button>
      <button onClick={onClose}>Anuluj</button>
    </div>
  );
}
export default AddFolder;