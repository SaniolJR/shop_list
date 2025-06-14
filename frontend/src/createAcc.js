import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style-account.css';

function CreateAccount() {
  const [email, setEmail] = useState('');
  const [passwd, setPasswd] = useState('');
  const [nick, setNick] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch("http://localhost:5016/register_account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passwd, nick }),
        });
        const data = await res.json();
        alert(data.message);
        if (data.success) {
            // przekieruj użytkownika do strony logowania lub innej strony
            window.location.href = "/login";
        }
    } catch (err) {
        console.error("Błąd podczas rejestracji:", err);
        alert("Wystąpił błąd podczas rejestracji. Spróbuj ponownie.");
    }
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
          <Link to="/login">
            <button className="account-form-button" type="button">Mam już konto</button>
          </Link>
            <button className="account-form-button" type="submit">Zarejestruj</button>
        </div>
      </form>
    </div>
  );
}

export default CreateAccount;
