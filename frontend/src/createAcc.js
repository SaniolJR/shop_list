import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style-account.css';

function CreateAccount() {
  const [email, setEmail] = useState('');
  const [passwd, setPasswd] = useState('');
  const [nick, setNick] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tutaj logika rejestracji (fetch do backendu)
  };

  return (
    <div className="account-form-container">
      <h2 className="account-form-title">Załóż konto</h2>
      <form onSubmit={handleSubmit}>
        <label className="account-form-label">
          Nick:
          <input
            className="account-form-input"
            type="text"
            value={nick}
            onChange={e => setNick(e.target.value)}
            required
          />
        </label>
        <label className="account-form-label">
          Email:
          <input
            className="account-form-input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="account-form-label">
          Hasło:
          <input
            className="account-form-input"
            type="password"
            value={passwd}
            onChange={e => setPasswd(e.target.value)}
            required
          />
        </label>
        <div className="account-form-buttons">
          <button className="account-form-button" type="submit">Zarejestruj</button>
          <Link to="/login">
            <button className="account-form-button" type="button">Mam już konto</button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateAccount;
