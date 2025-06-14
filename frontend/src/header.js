import React from 'react';
import { Link } from 'react-router-dom';
import './header-css.css';

// Przykładowo: userName jako props lub stała (na razie null)
const userName = null; // lub np. "Mateusz"

const Header = () => {
  return (
    <nav className='header'>
      <ul>
        <li><Link to="/carts">Koszyki</Link></li>
        {userName === null
          ? <li><Link to="/login">Zaloguj</Link></li>
          : <li><Link to="/account">{userName}</Link></li>
        }
      </ul>
    </nav>
  );
};

export default Header;