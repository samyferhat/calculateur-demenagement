import React, { useState } from 'react';

const AddItemForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [volume, setVolume] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const volumeValue = parseFloat(volume);
    if (!name.trim() || isNaN(volumeValue) || volumeValue <= 0) {
      alert('Veuillez saisir un nom valide et un volume > 0.');
      return;
    }

    onAdd({
      id: Date.now(), // ID unique
      name: name.trim(),
      volume: volumeValue,
    });

    // Réinitialiser le formulaire
    setName('');
    setVolume('');
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Nom de l'objet"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Volume (m³)"
        value={volume}
        onChange={(e) => setVolume(e.target.value)}
        step="0.01"
        min="0"
        style={styles.input}
      />
      <button type="submit" style={styles.button}>➕ Ajouter</button>
    </form>
  );
};

const styles = {
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        marginTop: '2rem',
        marginBottom: '1rem',
      },
      input: {
        flex: '1 1 150px',
        padding: '0.5rem',
      },
      
  button: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
};

export default AddItemForm;
