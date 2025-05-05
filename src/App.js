import { useEffect, useState } from 'react';
import { items as initialItems } from './data/itemsData';
import ItemSelector from './components/ItemSelector';
import VolumeDisplay from './components/VolumeDisplay';
import jsPDF from 'jspdf';
import AddItemForm from './components/AddItemForm';

function App() {
  const [selectedItems, setSelectedItems] = useState({});
  const [userInfo, setUserInfo] = useState({
    nom: '',
    prenom: '',
    adresse: '',
    date: '',
  });


  const LOCAL_STORAGE_KEY = 'demenagement_items';

  const loadItemsFromStorage = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialItems;
  };

  const [items, setItems] = useState(loadItemsFromStorage);

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

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };


  const downloadPDF = () => {
    const doc = new jsPDF();

    const marginLeft = 15;
    const lineHeight = 8;
    const pageHeight = doc.internal.pageSize.height;
    let y = 20;
    let pageCount = 1;

    const addPageIfNeeded = () => {
      if (y > pageHeight - 20) {
        doc.addPage();
        pageCount++;
        y = 20;
      }
    };

    // 🟦 Titre
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Calculateur de Volume de Déménagement', marginLeft, y);
    y += 12;

    // 🟩 Infos utilisateur
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nom : ${userInfo.nom}`, marginLeft, y); y += lineHeight;
    doc.text(`Prénom : ${userInfo.prenom}`, marginLeft, y); y += lineHeight;
    doc.text(`Adresse : ${userInfo.adresse}`, marginLeft, y); y += lineHeight;
    doc.text(`Date de déménagement souhaitée : ${userInfo.date}`, marginLeft, y); y += 15;

    // 🟨 Liste des objets
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Liste des objets', marginLeft, y); y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    const pages = []; // Pour stocker les pages à paginer à la fin
    pages.push(doc.internal.getNumberOfPages());

    let total = 0;
    items.forEach((item) => {
      const qty = selectedItems[item.id] || 0;
      if (qty > 0) {
        const itemVolume = (item.volume * qty).toFixed(2);
        addPageIfNeeded();
        doc.text(`• ${item.name} (x${qty})`, marginLeft, y);
        doc.text(`${itemVolume} m³`, 170, y, { align: 'right' });
        y += lineHeight;
        total += parseFloat(itemVolume);
      }
    });

    // 🟥 Volume total
    y += 10;
    addPageIfNeeded();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(`Volume total estimé : ${total.toFixed(2)} m³`, marginLeft, y);

    // 🧾 PAGINATION : après avoir ajouté toutes les pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(`Page ${i} / ${totalPages}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, {
        align: 'right'
      });
    }

    // ✅ Sauvegarde

    //inclure le nom du client dans le nom du fichier
    const fileName = `volume_demenagement_${userInfo.nom}_${userInfo.prenom}.pdf`;  
    doc.save(fileName);
  };

  const handleDeleteItem = (itemId) => {
    const itemToDelete = items.find((item) => item.id === itemId);
    const confirmed = window.confirm(`Supprimer "${itemToDelete?.name}" ?`);

    if (!confirmed) return;

    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setSelectedItems((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };
  return (
    <div style={styles.appContainer}>
      <div style={{ padding: '2rem' }}>
        <h1>📦 Calculateur de Volume de Déménagement</h1>
        <div style={styles.userInfoContainer}>
          <h3>Informations du client</h3>
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={userInfo.nom}
            onChange={handleUserInfoChange}
            style={styles.input}
          />
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={userInfo.prenom}
            onChange={handleUserInfoChange}
            style={styles.input}
          />
          <input
            type="text"
            name="adresse"
            placeholder="Adresse"
            value={userInfo.adresse}
            onChange={handleUserInfoChange}
            style={styles.input}
          />
          <label style={styles.label}>Date de déménagement souhaitée</label>
          <input
            type="date"
            name="date"
            value={userInfo.date}
            onChange={handleUserInfoChange}
            style={styles.input}
          />
        </div>

        <h3>Ajouter un objet personnalisé</h3>
        <AddItemForm onAdd={handleAddItem} />

        {items.map((item) => (
          <ItemSelector
            key={item.id}
            item={item}
            quantity={selectedItems[item.id] || 0}
            onQuantityChange={handleQuantityChange}
            onDelete={handleDeleteItem} // 🔥 toujours autorisé maintenant
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
  userInfoContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  },
  input: {
    flex: '1 1 200px',
    padding: '0.5rem',
  },
  label: {
    marginBottom: '4px',
    marginTop: '5px',
    fontSize: '0.9rem',
  }
};

export default App;
