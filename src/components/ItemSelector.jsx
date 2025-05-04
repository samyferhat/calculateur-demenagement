import React from 'react';

const ItemSelector = ({ item, quantity, onQuantityChange, onDelete }) => {
    const handleChange = (e) => {
      const newQuantity = parseInt(e.target.value, 10);
      onQuantityChange(item.id, newQuantity);
    };
  
    return (
      <div style={styles.container}>
        <span style={styles.name}>{item.name}</span>
        <select value={quantity} onChange={handleChange} style={styles.select}>
          {Array.from({ length: 21 }, (_, i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
        <span style={styles.volume}>
          Volume : {(item.volume * quantity).toFixed(2)} m³
        </span>
        {onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            style={styles.deleteButton}
            title="Supprimer l'objet"
          >
            🗑️
          </button>
        )}
      </div>
    );
  };
const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginBottom: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    select: {
        width: '80px',
        padding: '0.4rem',
    },
    name: {
        flex: '1 1 200px',
    },
    volume: {
        flex: '1 1 120px',
        color: '#666',
        fontStyle: 'italic',
    },
    deleteButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.2rem',
        marginLeft: '0.5rem',
      },
};

export default ItemSelector;
