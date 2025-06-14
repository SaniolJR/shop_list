import React from 'react';
import { Link } from 'react-router-dom';
import './header-css.css';

const Header = () => {
  return (
    <nav className='header'>
      <ul>
        <li><Link to="/carts">Koszyki</Link></li>
      </ul>
    </nav>
  );
};

export default Header;