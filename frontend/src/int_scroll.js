import React, { useEffect, useState } from "react";

function InfScroll({ containerTypeHTTPGet, ContainerType }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(containerTypeHTTPGet);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setItems([]);
      }
    };
    fetchAll();
  }, [containerTypeHTTPGet]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        width: "100%"
      }}
    >
      {items.map((item, idx) => (
        <ContainerType key={`${item.id_cart_list}_${idx}`} {...item} />
      ))}
    </div>
  );
}

export default InfScroll;