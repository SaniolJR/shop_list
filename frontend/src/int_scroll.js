import React, { useEffect, useState, useRef } from "react";

function InfScroll({ containerTypeHTTPGet, ContainerType }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const isFetching = useRef(false); // blokada fetchowania

  const fetchData = async (customPage = page, reset = false) => {
    if (isFetching.current) return;
    if (!hasMore && !reset) return;
    isFetching.current = true;
    try {
      const url = containerTypeHTTPGet.includes('?')
        ? `${containerTypeHTTPGet}&page=${customPage}&limit=9`
        : `${containerTypeHTTPGet}?page=${customPage}&limit=9`;
      const res = await fetch(url);
      const data = await res.json();
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
      setHasMore(false);
    }
    isFetching.current = false;
  };

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchData(1, true);
    // eslint-disable-next-line
  }, [containerTypeHTTPGet]);

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