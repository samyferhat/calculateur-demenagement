import React from 'react';

const VolumeDisplay = ({ volume }) => {
  return (
    <div style={styles.container}>
      <h2>Volume total estimé :</h2>
      <p style={styles.volume}>{volume.toFixed(2)} m³</p>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '2rem',
    padding: '1rem',
    borderTop: '1px solid #ccc',
  },
  volume: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#007bff',
  },
};

export default VolumeDisplay;
