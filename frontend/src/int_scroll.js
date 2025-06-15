import React, { useEffect, useState } from "react";


//funkcja odpowiadająca za ładowanie wszyskich elementów z BE i renderowanie ich w siatke
function InfScroll({ containerTypeHTTPGet, ContainerType }) {
  //useState do przechowywania elementów pobranych z BE
  const [items, setItems] = useState([]);

  //useEffect do pobierania danych z backendu przy pierwszym renderowaniu komponentu
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(containerTypeHTTPGet);  // pobierz dane z podanego URL
        const data = await res.json();  //zmień odp na JSON
        setItems(Array.isArray(data) ? data : []);  //ustaw dane w useState, sprawdzając czy są tablicą
      } catch (err) {
        setItems([]); //walidacja błędu
        console.error("Błąd podczas pobierania danych:", err);
      }
    };
    fetchAll();
  }, [containerTypeHTTPGet]);
  
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",  //3 kolumny
        gap: "16px",
        width: "100%"
      }}
    >
      {/* renderuj każdy element jako osobny komponent przekazując mu propsy */}
      {items.map((item, idx) => (
        <ContainerType key={`${item.id_cart_list}_${idx}`} {...item} />
      ))}
    </div>
  );
}

export default InfScroll;