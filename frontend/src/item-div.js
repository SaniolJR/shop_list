import React from 'react';
import './style-item.css';
import { Link } from 'react-router-dom';
/*
baza danych dla item zawiera:
id_item
name
description
price
currency
link
imageURL
*/
function Item(props){
    return (
      <div className={`item-main-container`}>
        <Link to={`/item/${props.id_item}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="item-name">{props.name}</div>
        </Link>

        <div className="item-price">{props.price} {props.currency}</div>

        <a href={props.imageURL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img
                className="item-image"
                src={props.imageURL}
                alt=""
                draggable={false}
            />
        </a>
      </div>
    );
}

export default Item;