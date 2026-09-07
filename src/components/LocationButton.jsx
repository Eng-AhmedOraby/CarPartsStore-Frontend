function LocationButton({ latitude, longitude }) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  return (
    <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="location-btn">
      اعرف الطريق للمحل
    </a>
  );
}

export default LocationButton;
