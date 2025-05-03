import React from 'react';

const ItemSelector = ({ item, quantity, onQuantityChange }) => {
    const handleChange = (e) => {
        const newQuantity = parseInt(e.target.value) || 0;
        onQuantityChange(item.id, newQuantity);
    };

    return (
        <div style={styles.container}>
            <span style={styles.name}>{item.name}</span>
            <input
                type="number"
                min="0"
                value={quantity}
                onChange={handleChange}
                style={styles.input}
            />
            <span style={styles.volume}>
                Volume : {(item.volume * quantity).toFixed(2)} m³
            </span>
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
    input: {
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
      
};

export default ItemSelector;
