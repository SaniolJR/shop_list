import React from 'react';
import './style-cart.css';
import cartIMG from './cartIMG.png';
import { Link } from 'react-router-dom';

function bg_color(color){ //do rozbudowy - nic innego nie obsługuje różnych kolorów niż ta funkcja
  switch(color) {
    case 'red': return 'bg-red';
    case 'blue': return 'bg-blue';
    case 'green': return 'bg-green';
    case 'yellow': return 'bg-yellow';
    case 'purple': return 'bg-purple';
    case 'white': return 'bg-white';
    case 'pink': return 'bg-pink';
    default: return 'bg-blue';
  }
}

function Cart(props) {
  const bgClass = bg_color(props.color);

  return (
    <Link to={`/cart/${props.id_cart}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className={`main-container ${bgClass}`}>
        <img
          className="bg-image"
          src={cartIMG}
          alt=""
          draggable={false}
        />
        <div className="title">{props.name}</div>
        <div className="description">{props.description}</div>
      </div>
    </Link>
  );
}

export default Cart;