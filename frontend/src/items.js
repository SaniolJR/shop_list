import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfScroll from "./int_scroll";
import Item from "./item-div";
import AddButton from "./addButton";

function Items() {
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

  const { id } = useParams(); // id koszyka z URL

  return (
    <main>
      <InfScroll
        containerTypeHTTPGet={`http://localhost:5016/return_items_list?userId=${userId}&cartId=${id}`}
        ContainerType={Item}
      />
      {/* Przycisk dodawania produktu widoczny tylko gdy userId i id koszyka są znane */}
      {userId && id && (
        <AddButton
          mode="item"
          onClick={() => setShowAdd(true)}
          cartId={id}
          userId={userId}
        />
      )}
      {/* Tu możesz dodać modal do dodawania produktu, jeśli showAdd === true */}
    </main>
  );
}

export default Items;