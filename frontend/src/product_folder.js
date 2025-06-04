import React from 'react';
import ReactDOM from 'react-dom/client';
import './style-folder.css';


function bg_color(color){
  switch(color) {
    case 'red':
      return 'bg-red';
    case 'blue':
      return 'bg-blue';
    case 'green':
      return 'bg-green';
    case ' yellow':
      return 'bg-yellow';
    case 'purple':
      return 'bg-purple';
    case 'white':
      return 'bg-white';
    case 'pink':
      return 'bg-pink';
    default:
      return 'bg-default'; // Default background color
  }
}


function Folder(props) {
  const bgClass = bg_color(props.color);

  return (
    <div className={`main-container ${bgClass}`}>
      <h2 className="title">RTX 3070TI</h2>
      <p className="description">Karta graficzna RTX 3070SI Suprim X od MSI</p>
      <p className="category">Komputer</p>
    </div>
  );
}

export default Folder;