import React from 'react';
import './header-css.css';

const Header = ({ onSelectComponent }) => {
  return (
    <nav className='navBar'>
      <ul>
        <li><a href="#" onClick={e => { e.preventDefault(); onSelectComponent('events'); }}>Szukaj</a></li>
        <li><a href="#" onClick={e => { e.preventDefault(); onSelectComponent('rooms'); }}>Wyloguj</a></li>
        <li><a href="#" onClick={e => { e.preventDefault(); onSelectComponent('reservations'); }}>Konto</a></li>
        <li><a href="#" onClick={e => { e.preventDefault(); onSelectComponent('payments'); }}>Urzytkownik</a></li>
      </ul>
    </nav>
  );
};

export default Header;