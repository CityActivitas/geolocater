import React from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '1500px',
  height: '500px',
};

// const center = {
//   lat: 23.516721871402645, // default latitude
//   lng: 120.4418507540825, // default longitude
// };

const center = {
  lat: -34.397,
  lng: 150.644
};

const locations = [
  { lat: -34.397, lng: 150.644 },
  { lat: -34.407, lng: 150.654 },
  { lat: -34.417, lng: 150.664 }
];


const SampleMap = () => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15}
        center={center}
      >
        {locations.map((location, index) => (
          <MarkerF key={index} position={location} />
        ))}
      </GoogleMap>
    </div>
  );
};

export default SampleMap;
