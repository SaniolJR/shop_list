import React from 'react';
import './style-folder.css';

function bg_color(color){
  switch(color) {
    case 'red':
      return 'bg-red';
    case 'blue':
      return 'bg-blue';
    case 'green':
      return 'bg-green';
    case 'yellow':
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

// Komponent Folder wyświetla dane z propsów
function Folder(props) {
  const bgClass = bg_color(props.color);

  return (
    <div className={`main-container ${bgClass}`}>
      <h2 className="title">Koszyk #{props.id_cart}</h2>
      <div>ID listy: {props.id_cart_list}</div>
      <div>ID użytkownika: {props.user_id_user}</div>
    </div>
  );
}

export default Folder;