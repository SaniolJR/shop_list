import React, { useState, useEffect } from "react";
import InfScroll from "./int_scroll";
import Cart from "./cart-div";
import AddButton from "./addButton";
import AddCart from "./addCart";

function Carts() {
  const [showAdd, setShowAdd] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Pobierz userId z backendu
    fetch("http://localhost:5016/me", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.userId) setUserId(data.userId);
      });
  }, []);

  if (!userId) return <div>Ładowanie...</div>;

  return (
    <main>
      <InfScroll
        containerTypeHTTPGet={`http://localhost:5016/return_cart_list?userId=${userId}`}
        ContainerType={Cart}
      />
      <AddButton mode="cart" onClick={() => setShowAdd(true)} />
      {showAdd && <AddCart onClose={() => setShowAdd(false)} />}
    </main>
  );
}

export default Carts;