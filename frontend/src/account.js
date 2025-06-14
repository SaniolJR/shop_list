import React, { useEffect, useState } from "react";
import "./style-account.css";

function Account() {
  const [user, setUser] = useState({ nick: "", email: "" });
  const [editField, setEditField] = useState(null); // "nick" lub "email"
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5016/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser({ nick: data.nick, email: data.email });
        }
      } catch (err) {}
    };
    fetchUser();
  }, []);

  const handleEdit = (field) => {
    setEditField(field);
    setNewValue(user[field]);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5016/update_account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ [editField]: newValue }),
      });
      if (res.ok) {
        setUser(prev => ({ ...prev, [editField]: newValue }));
        setEditField(null);
      } else {
        alert("Błąd podczas zapisywania zmian.");
      }
    } catch {
      alert("Błąd sieci.");
    }
    setLoading(false);
  };

  return (
    <div className="account-form-container">
      <h2 className="account-form-title">Twoje konto</h2>
      <div style={{ width: "100%", maxWidth: "50vw" }}>
        <div className="account-form-label" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <span><strong>Nick:</strong></span>
          {editField === "nick" ? (
            <>
              <input
                className="account-form-input"
                style={{ width: "20vw", marginLeft: "1vw" }}
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
              />
              <button
                className="account-form-button"
                style={{ marginLeft: "1vw" }}
                onClick={handleSave}
                disabled={loading}
              >
                Zapisz zmiany
              </button>
            </>
          ) : (
            <>
              <span style={{ marginLeft: "1vw" }}>{user.nick}</span>
              <button className="account-form-button" style={{ marginLeft: "1vw" }} onClick={() => handleEdit("nick")}>Zmień</button>
            </>
          )}
        </div>
        <div className="account-form-label" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <span><strong>Email:</strong></span>
          {editField === "email" ? (
            <>
              <input
                className="account-form-input"
                style={{ width: "20vw", marginLeft: "1vw" }}
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
              />
              <button
                className="account-form-button"
                style={{ marginLeft: "1vw" }}
                onClick={handleSave}
                disabled={loading}
              >
                Zapisz zmiany
              </button>
            </>
          ) : (
            <>
              <span style={{ marginLeft: "1vw" }}>{user.email}</span>
              <button className="account-form-button" style={{ marginLeft: "1vw" }} onClick={() => handleEdit("email")}>Zmień</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;