import React, { useEffect, useState, useRef } from "react";

function InfScroll({ containerTypeHTTPGet, ContainerType }) {
  //useState - to przechowywania stanu danego komponentu (zmiennej jakiegokolwiek typu)
  const [items, setItems] = useState([]); // przechowuje dane pobrane z API
  const [page, setPage] = useState(1); // przechowuje aktualną stronę
  const [hasMore, setHasMore] = useState(true); // informuje czy są jeszcze dane do pobrania
  //useRef - przechowuje referencję do elementu DOM (elemnt HTML jak div) i pozwala wykonać kod po renderze
  const loader = useRef(null);  // referencja do elementu, który będzie obserwowany przez IntersectionObserver - czy ładować więcej danych
  const isFetching = useRef(false); // blokada fetchowania - aby nie wykonywać wielu zapytań do API w tym samym czasie

  const fetchData = async (customPage = page, reset = false) => {
    if (isFetching.current) return; //jeśli już trwa fetchowanie, to nie wykonuj kolejnego
    if (!hasMore && !reset) return; // jeśli nie ma więcej danych i nie resetujemy, to nie wykonuj kolejnego fetchowania
    isFetching.current = true;  // blokada fetchowania wlaczona
    //---pobieranie danych z BE---
    try {
      const url = containerTypeHTTPGet.includes('?')
        ? `${containerTypeHTTPGet}&page=${customPage}&limit=9`
        : `${containerTypeHTTPGet}?page=${customPage}&limit=9`;
      const res = await fetch(url); //wyslij zapytanie do API
      const data = await res.json();  //pobierz dane w formacie JSON
      //---sprawdzenie czy dane są poprawne---
      if (!Array.isArray(data)) {
        setHasMore(false);
        isFetching.current = false;
        return;
      }
      if (data.length === 0) {
        setHasMore(false);
      } else {
        if (reset) {
          setItems(data);
        } else {
          setItems(prev => [...prev, ...data]);
        }
        setPage(prev => prev + 1);
      }
    } catch (err) {
      setHasMore(false);    //obsługa błędów
    }
    isFetching.current = false; //koniec fetchowania, blokada wyłączona
  };

  //useEffect - hook, który wykonuje kod po renderze komponentu, zawsze gdy coś sie zmieni
  //-----reaguje na zmiany containerTypeHTTPGet i resetuje stan komponentu-----
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchData(1, true);
    // eslint-disable-next-line
  }, [containerTypeHTTPGet]);
//-----reaguje na zmiany page i hasMore i wykonuje fetchData-----
  useEffect(() => {
    if (!loader.current) return;
    //obserwuje element loader i sprawdza czy jest widoczny w oknie przeglądarki
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
    //html i CSS dla komponentu InfScroll
    <div
    style={{
      display: "grid",
      gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, 1fr)`,
      gap: "16px",
      width: "100%",
    }}
  >
    {items.map((item, idx) => (
      <ContainerType key={`${item.id_cart_list}_${idx}`} {...item} />
    ))}
    {hasMore && (
      <div
        ref={loader}
        style={{ gridColumn: "1 / -1", textAlign: "center", padding: "20px" }}
      >
      </div>
    )}
  </div>
  );
}

export default InfScroll;