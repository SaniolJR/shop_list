import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './main';
// import { BrowserRouter } from 'react-router-dom'; // zakomentuj lub usuń

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <BrowserRouter>
    <Main />
  // </BrowserRouter>
);