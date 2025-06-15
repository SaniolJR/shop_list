import React, { useState } from "react";
import "./style-delete.css"; // Zakładając, że masz plik CSS dla stylów

function DeleteCart({ onClose, cartId, userId }) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

   const handleDeleteCart = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5016/delete_cart?cartId=${cartId}`, {
        method: "DELETE",
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onClose();
        alert("Koszyk został pomyślnie usunięty.");
        window.location.reload();
        window.location.href = "/carts"; // Przekierowanie do listy koszyków
      } else {
        setError(data.message || "Nie udało się usunąć koszyka.");
      }
    } catch (err) {
      setError("Błąd sieci. Spróbuj ponownie.");
    }
    setLoading(false);
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