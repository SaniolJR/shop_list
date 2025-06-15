import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style-account.css';

const LogUser = {
  userNick: "",
  userID: "",
  userEmail: ""
};

function Login() {
  const [email, setEmail] = useState('');
  const [passwd, setPasswd] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5016/login_account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passwd }),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        window.location.href = "/account";
        // (LogUser nie jest już potrzebny, bo masz ciasteczko)
      } else {
        alert(data.message || "Nieprawidłowy email lub hasło.");
      }
    } catch (err) {
      console.error("Błąd podczas logowania:", err);
      alert("Wystąpił błąd podczas logowania. Sprawdź dane i spróbuj ponownie.");
    }
  };

  return (
    <div className="account-form-container">
      <h2 className="account-form-title">Logowanie</h2>
      <form onSubmit={handleSubmit}>
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
          <Link to="/register">
            <button className="account-form-button" type="button">Załóż konto</button>
          </Link>
            <button className="account-form-button" type="submit">Zaloguj</button>
        </div>
      </form>
    </div>
  );
}


export default Login;