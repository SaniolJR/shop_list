import React, { useEffect, useState } from "react";
import "./style-account.css";

function Account() {
  const [user, setUser] = useState({ nick: "", email: "" });
  const [editField, setEditField] = useState(null); // "nick", "email", "password"
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

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
    setNewValue("");
  };

  const handleSave = async () => {
    setLoading(true);
    let body = {};
    if (editField === "password") {
      body = { passwd: newValue };
    } else {
      body = { [editField]: newValue };
    }
    try {
      const res = await fetch("http://localhost:5016/update_account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        if (editField !== "password") setUser(prev => ({ ...prev, [editField]: newValue }));
        setEditField(null);
        setNewValue("");
        if (editField === "password") alert("Hasło zostało zmienione.");
      } else {
        alert("Błąd podczas zapisywania zmian.");
      }
    } catch {
      alert("Błąd sieci.");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (deleteConfirm !== "USUŃ") {
      alert('Aby usunąć konto, wpisz "USUŃ" w pole potwierdzenia.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5016/delete_account", {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        alert("Konto zostało usunięte.");
        window.location.href = "/login";
      } else {
        alert("Błąd podczas usuwania konta.");
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
        {/* Nick */}
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
        {/* Email */}
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
        {/* Hasło */}
        <div className="account-form-label" style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <span><strong>Hasło:</strong></span>
          {editField === "password" ? (
            <>
              <input
                className="account-form-input"
                style={{ width: "20vw", marginLeft: "1vw" }}
                type="password"
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder="Nowe hasło"
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
              <span style={{ marginLeft: "1vw" }}>********</span>
              <button className="account-form-button" style={{ marginLeft: "1vw" }} onClick={() => handleEdit("password")}>Zmień</button>
            </>
          )}
        </div>
        {/* Usuń konto */}
        <div className="account-form-label" style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: "2vh" }}>
          {!showDelete ? (
            <button
              className="account-form-button"
              style={{ background: "#e53935", marginLeft: "1vw" }}
              onClick={() => setShowDelete(true)}
            >
              Usuń konto
            </button>
          ) : (
            <>
              <input
                className="account-form-input"
                style={{ width: "20vw", marginLeft: "1vw" }}
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder='Wpisz "USUŃ"'
              />
              <button
                className="account-form-button"
                style={{ background: "#e53935", marginLeft: "1vw" }}
                onClick={handleDelete}
                disabled={loading}
              >
                Potwierdź usunięcie
              </button>
              <button
                className="account-form-button"
                style={{ marginLeft: "1vw" }}
                onClick={() => { setShowDelete(false); setDeleteConfirm(""); }}
                disabled={loading}
              >
                Anuluj
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;