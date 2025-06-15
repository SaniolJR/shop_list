import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./style-item-edit.css";

function ItemEdit() {
    const { id } = useParams();
    
    // Stan dla danych produktu
    const [item, setItem] = useState({
        name: "",
        description: "",
        price: 0,
        currency: "",
        link: "",
        imageURL: ""
    });

    // Stan dla modali edycji
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState("");

    // Ładowanie danych produktu
    useEffect(() => {
        const fetchItemData = async () => {
            try {
                const response = await fetch(`http://localhost:5016/get_item_details/${id}`);
                const data = await response.json();
                
                setItem({
                    name: data.name || "",
                    description: data.description || "",
                    price: data.price || 0,
                    currency: data.currency || "",
                    link: data.link || "",
                    imageURL: data.imageURL || ""
                });
            } catch (error) {
                console.error("Błąd podczas ładowania danych produktu:", error);
            }
        };

        if (id) {
            fetchItemData();
        }
    }, [id]);

    // Funkcja do rozpoczęcia edycji
    const startEdit = (field) => {
        setEditingField(field);
        setEditValue(item[field]);
    };

    // Funkcja do zapisania zmiany
    const saveEdit = async () => {
        try {
            const updatedItem = { ...item, [editingField]: editValue };
            
            const response = await fetch(`http://localhost:5016/update_item/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedItem),
            });

            if (response.ok) {
                setItem(updatedItem);
                setEditingField(null);
                setEditValue("");
                alert("Zmiana została zapisana!");
            } else {
                alert("Błąd podczas zapisywania");
            }
        } catch (error) {
            console.error("Błąd:", error);
            alert("Błąd sieci. Spróbuj ponownie.");
        }
    };

    // Funkcja do anulowania edycji
    const cancelEdit = () => {
        setEditingField(null);
        setEditValue("");
    };

    // Funkcja do otwierania linku
    const openLink = () => {
        if (item.link) {
            window.open(item.link, '_blank');
        }
    };

    return (
        <div className="item-details-container">
            <h2>Szczegóły Produktu</h2>
            
            <div className="item-content">
                {/* LEWA STRONA */}
                <div className="left-side">
                    {/* NAZWA */}
                    <div className="info-row">
                        <div className="info-content">
                            <h3>Nazwa:</h3>
                            <p>{item.name || "Brak nazwy"}</p>
                        </div>
                        <button 
                            className="edit-btn"
                            onClick={() => startEdit('name')}
                        >
                            ✏️ Edytuj
                        </button>
                    </div>

                    {/* CENA Z WALUTĄ */}
                    <div className="info-row">
                        <div className="info-content">
                            <h3>Cena:</h3>
                            <p>{item.price} {item.currency}</p>
                        </div>
                        <button 
                            className="edit-btn"
                            onClick={() => startEdit('price')}
                        >
                            ✏️ Edytuj
                        </button>
                    </div>

                    {/* WALUTA (osobno) */}
                    <div className="info-row">
                        <div className="info-content">
                            <h3>Waluta:</h3>
                            <p>{item.currency || "Brak waluty"}</p>
                        </div>
                        <button 
                            className="edit-btn"
                            onClick={() => startEdit('currency')}
                        >
                            ✏️ Edytuj
                        </button>
                    </div>

                    {/* LINK DO SKLEPU */}
                    <div className="info-row">
                        <div className="info-content">
                            <h3>Sklep:</h3>
                            <button 
                                className="shop-btn"
                                onClick={openLink}
                                disabled={!item.link}
                            >
                                🛒 Otwórz w sklepie
                            </button>
                        </div>
                        <button 
                            className="edit-btn"
                            onClick={() => startEdit('link')}
                        >
                            ✏️ Edytuj
                        </button>
                    </div>
                </div>

                {/* PRAWA STRONA */}
                <div className="right-side">
                    {/* OPIS */}
                    <div className="info-row">
                        <div className="info-content">
                            <h3>Opis:</h3>
                            <p>{item.description || "Brak opisu"}</p>
                        </div>
                        <button 
                            className="edit-btn"
                            onClick={() => startEdit('description')}
                        >
                            ✏️ Edytuj
                        </button>
                    </div>
                </div>
            </div>

            {/* ZDJĘCIE - PO ŚRODKU POD TEKSTEM */}
            <div className="image-section">
                <h3>Zdjęcie produktu:</h3>
                {item.imageURL ? (
                    <img 
                        src={item.imageURL} 
                        alt={item.name}
                        className="product-image"
                    />
                ) : (
                    <div className="no-image">Brak zdjęcia</div>
                )}
                <button 
                    className="edit-btn"
                    onClick={() => startEdit('imageURL')}
                >
                    ✏️ Edytuj zdjęcie
                </button>
            </div>

            {/* MODAL EDYCJI */}
            {editingField && (
                <div className="edit-modal">
                    <div className="edit-modal-content">
                        <h3>Edytuj: {editingField}</h3>
                        
                        {editingField === 'description' ? (
                            <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                maxLength={200}
                                rows={4}
                                className="edit-input"
                            />
                        ) : (
                            <input
                                type={editingField === 'price' ? 'number' : 'text'}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                maxLength={editingField === 'name' ? 100 : 200}
                                className="edit-input"
                            />
                        )}
                        
                        <div className="edit-buttons">
                            <button onClick={saveEdit} className="save-btn">
                                ✅ Zapisz
                            </button>
                            <button onClick={cancelEdit} className="cancel-btn">
                                ❌ Anuluj
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ItemEdit;