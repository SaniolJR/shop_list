import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfScroll from "./int_scroll";
import Item from "./item-div";
import AddButton from "./addButton";
import DeleteButton from "./deleteButton";
import DeleteCart from "./deleteCart";

function Items() {
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5016/me", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.userId) setUserId(data.userId);
      });
  }, []);

  const { id } = useParams();

  // NIE renderuj InfScroll, dopóki userId nie jest znane
  if (!userId) return <div>Ładowanie...</div>;

  return (
    <main>
      <InfScroll
        containerTypeHTTPGet={`http://localhost:5016/return_items_list?userId=${userId}&cartId=${id}`}
        ContainerType={Item}
      />
      {userId && id && (
        <>
          <AddButton
            mode="item"
            onClick={() => setShowAdd(true)}
            cartId={id}
            userId={userId}
          />
          <DeleteButton
            mode="cart"
            onClick={() => setShowDelete(true)}
            cartId={id}
            userId={userId}
          />
        </>
      )}
      {showDelete && (
        <DeleteCart
          cartId={id}
          userId={userId}
          onClose={() => setShowDelete(false)}
        />
      )}
    </main>
  );
}

export default Items;