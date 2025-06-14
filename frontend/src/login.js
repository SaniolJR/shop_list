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
    try{
      const res = await fetch("http://localhost:5016/login_account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passwd }),
        credentials: 'include' // ważne, aby wysłać ciasteczka z żądaniem
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) {
        // przekieruj użytkownika do strony głównej lub innej strony
       if (res.ok) {
          window.location.href = "/account";  // przekierowanie do strony konta
          LogUser.userNick = data.user.nick; // zakładając, że nick jest zwracany w odpowiedzi
          LogUser.userID = data.user.userId; // zakładając, że userId jest zwracany w odpowiedzi
          LogUser.userEmail = data.user.email; // zakładając, że email jest zwracany w odpowiedzi
        }
      }
    }
    catch (err) {
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
          <button className="account-form-button" type="submit">Zaloguj</button>
          <Link to="/create-account">
            <button className="account-form-button" type="button">Załóż konto</button>
          </Link>
        </div>
      </form>
    </div>
  );
}


export default Login;