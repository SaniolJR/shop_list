import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./header";
import Carts from './Carts';
import Login from "./login";
import CreateAcc from "./createAcc";
import Account from "./account";
import Items from "./items";
import Item from "./item-div";
import ItemEdit from "./item-edit";
import "./style.css";


function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/carts" element={<Carts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CreateAcc />} />
        <Route path="/account" element={<Account />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/:id" element={<Items />} />
        <Route path="/item/:id" element={<Item />} />
        <Route path="/item-edit/:id" element={<ItemEdit />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;