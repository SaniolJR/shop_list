import React from 'react';
import ReactDOM from 'react-dom/client';
import './style-folder.css';

function Folder() {
  return (
    <div className="main-container">
      <h2 className = "title">Nazwa</h2>
        <p className = "description">Opis</p>
        <p className = "category">Kategoria</p>
    </div>
  );
}


export default Folder;