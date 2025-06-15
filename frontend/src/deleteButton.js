import React from "react";

function DeleteButton({ mode = "cart", onClick }) {
  const label = mode === "item" ? "Usuń przedmiot" : "Usuń koszyk";
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        left: "32px",
        bottom: "32px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "110px",
        height: "80px",
        background: "#e53935",
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
          color: "#fff",
          fontWeight: "bold",
          lineHeight: "1",
          userSelect: "none",
        }}
      >
        ×
      </span>
      <span
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: "1rem",
          userSelect: "none",
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </button>
  );
}

export default DeleteButton;