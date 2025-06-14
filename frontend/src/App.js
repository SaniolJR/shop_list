import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./header";
import InfScroll from "./int_scroll";
import Folder from "./product_folder";
import Carts from './Carts';
import "./style.css";

// Przykładowy komponent dla produktów (zrób swój własny)
function Items() {
  return (
    <main>
      <InfScroll
        containerTypeHTTPGet={`http://localhost:5016/return_items_list?userId=1`}
        ContainerType={Folder} // zamień na swój komponent produktu
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;