import React from 'react';
import { GoogleMap, useLoadScript, MarkerF, MarkerClustererF } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '1500px',
  height: '500px',
};

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
        <MarkerClustererF>
          {clusterer =>
            locations.map((location, index) => (
              <MarkerF key={index} position={location} />
            ))
          }
        </MarkerClustererF>
      </GoogleMap>
    </div>
  );
};

export default SampleMap;
