import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./header";
import InfScroll from "./int_scroll";
import Carts from './Carts';
import Cart from "./cart-div";
import Login from "./login";
import CreateAcc from "./createAcc";
import Account from "./account";
import CartView from "./cartView";
import "./style.css";

// Przykładowy komponent dla produktów (zrób swój własny)
function Items() {
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
        containerTypeHTTPGet={`http://localhost:5016/return_items_list?userId=${userId}`}
        ContainerType={Cart} // zamień na swój komponent produktu
      />
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/carts" element={<Carts />} />
        <Route path="/items" element={<Items />} />
        <Route path="/login" element={<Login />} />
        <Route path="register" element={<CreateAcc />} />
        <Route path="/account" element={<Account />} />
        <Route path="/cart/:id" element={<CartView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;