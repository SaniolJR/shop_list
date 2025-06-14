import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './header-css.css';

const Header = () => {
  const [userNick, setUserNick] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5016/me", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.nick) setUserNick(data.nick);
        else setUserNick(null);
      })
      .catch(() => setUserNick(null));
  }, []);

  const handleLogout = async () => {
    await fetch("http://localhost:5016/logout", {
      method: "POST",
      credentials: "include"
    });
    window.location.reload();
  };

  return (
    <nav className='header'>
      <ul>
        <li><Link to="/carts">Koszyki</Link></li>
        {userNick === null ? (
          <li><Link to="/login">Zaloguj</Link></li>
        ) : (
          <>
            <li><Link to="/account">{userNick}</Link></li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Wyloguj
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;