import React from "react";
import "./style-delete.css"; // Zakładając, że masz plik CSS dla stylów

function DeleteCart({ onClose, cartId, userId }) {
  const handleDeleteCart = async () => {
    // Wyślij żądanie do backendu, aby usunąć koszyk
    await fetch(`http://localhost:5016/delete_cart?cartId=${cartId}`, {
    method: "DELETE",
    credentials: "include"
    });
    onClose(); // Zamknij modal po usunięciu koszyka
  };

  return (
    <div className="delete-cart">
      <h2 className="title">Usuń koszyk</h2>
     <h2 className="confirm-ask">Czy na pewno chcesz usunąć ten koszyk?</h2>
      <div className="button-row">
        <button className="button" onClick={onClose}>Anuluj</button>
        <button className="button" onClick={handleDeleteCart}>Usuń</button>
      </div>
    </div>
  );
}

export default DeleteCart;