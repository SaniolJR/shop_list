import React from "react";

function AddButton({ mode = "cart", onClick }) {
  const label = mode === "cart" ? "Dodaj koszyk" : "Dodaj przedmiot";

  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        right: "32px",
        bottom: "32px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "80px",
        height: "80px",
        background: "#2ecc40",
        border: "none",
        borderRadius: "16px",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        transition: "background 0.2s",
      }}
    >
      <span
        style={{
          fontSize: "2.5rem",
          color: "#27ae60",
          fontWeight: "bold",
          lineHeight: "1",
          userSelect: "none",
        }}
      >
        +
      </span>
      <span
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1rem",
          userSelect: "none",
        }}
      >
        {label}
      </span>
    </button>
  );
}

export default AddButton;