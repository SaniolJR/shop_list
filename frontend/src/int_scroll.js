import React, { useEffect, useState, useRef } from "react";

// Uniwersalny komponent z infinite scrollem i siatką 3 kolumn
function InfScroll({ containerTypeHTTPGet, ContainerType }) {
  const [items, setItems] = useState([]); // Przechowuje pobrane elementy
  const [page, setPage] = useState(1); // Numer aktualnej strony (do paginacji)
  const [hasMore, setHasMore] = useState(true); // Czy są jeszcze dane do pobrania
  const loader = useRef(null); // Ref do "loadera" na dole listy

  // Funkcja pobierająca dane z backendu
  const fetchData = async () => {
    if (!hasMore) return;
    try {
      const res = await fetch(`${containerTypeHTTPGet}?page=${page}&limit=9`);
      const data = await res.json();
      if (data.length === 0) {
        setHasMore(false); // Brak więcej danych
      } else {
        setItems(prev => [...prev, ...data]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setHasMore(false);
    }
  };

  // Efekt do pobrania pierwszej strony
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Efekt do obsługi infinite scrolla (Intersection Observer)
  useEffect(() => {
    if (!loader.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchData();
        }
      },
      { threshold: 1 }
    );
    observer.observe(loader.current);
    return () => observer.disconnect();
    // eslint-disable-next-line
  }, [loader.current, hasMore]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        width: "100%",
      }}
    >
      {items.map((item, idx) => (
        <ContainerType key={item.id || idx} {...item} />
      ))}
      {/* Loader na dole listy */}
      {hasMore && (
        <div
          ref={loader}
          style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}
        >
          Ładowanie...
        </div>
      )}
    </div>
  );
}

export default InfScroll;