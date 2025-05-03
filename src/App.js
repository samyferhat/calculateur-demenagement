import { useState } from 'react';
import { items as initialItems } from './data/itemsData';
import ItemSelector from './components/ItemSelector';
import VolumeDisplay from './components/VolumeDisplay';
import jsPDF from 'jspdf';
import AddItemForm from './components/AddItemForm';

function App() {
  const [selectedItems, setSelectedItems] = useState({});

  const [items, setItems] = useState(initialItems);

  const handleQuantityChange = (id, quantity) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: quantity,
    }));
  };

  const totalVolume = Object.entries(selectedItems).reduce((acc, [id, qty]) => {
    const item = items.find((i) => i.id === parseInt(id));
    return acc + (item?.volume || 0) * qty;
  }, 0);

  const resetQuantities = () => {
    setSelectedItems({});
  };

  const handleAddItem = (newItem) => {
    setItems((prev) => [...prev, newItem]);
  };
  
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Calculateur de Volume de Déménagement', 10, 20);
  
    let y = 35;
    doc.setFontSize(12);
    items.forEach((item) => {
      const qty = selectedItems[item.id] || 0;
      if (qty > 0) {
        const itemVolume = (item.volume * qty).toFixed(2);
        doc.text(`${item.name} (x${qty}) - ${itemVolume} m³`, 10, y);
        y += 10;
      }
    });
  
    doc.setFontSize(14);
    doc.text(`Volume total : ${totalVolume.toFixed(2)} m³`, 10, y + 10);
  
    doc.save('volume_demenagement.pdf');
  };
  
  
  return (
    <div style={styles.appContainer}>
    <div style={{ padding: '2rem' }}>
      <h1>📦 Calculateur de Volume de Déménagement</h1>
      <h2>Ajouter un objet personnalisé</h2>
<AddItemForm onAdd={handleAddItem} />

      {items.map((item) => (
        <ItemSelector
          key={item.id}
          item={item}
          quantity={selectedItems[item.id] || 0}
          onQuantityChange={handleQuantityChange}
        />
      ))}
      <button onClick={resetQuantities} style={styles.resetButton}>
   Réinitialiser
</button>

      <VolumeDisplay volume={totalVolume} />
      <button onClick={downloadPDF} style={styles.pdfButton}>
  📥 Télécharger en PDF
</button>

    </div>
    </div>
  );
}

const styles = {
  resetButton: {
    marginTop: '1.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  pdfButton: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '1rem',
  },
  appContainer: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '1rem',
  },
  
  
};

export default App;
