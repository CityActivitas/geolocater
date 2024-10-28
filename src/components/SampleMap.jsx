import React from 'react';
import { GoogleMap, useLoadScript, MarkerF, MarkerClustererF } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '1200px',
  height: '500px',
};

// 修改 center 位置到台灣
const center = {
  lat: 25.0330,  // 台北市中心附近
  lng: 121.5654
};

// 增加更多測試位置點
const locations = [
  { lat: 25.0330, lng: 121.5654 }, // 台北市中心
  { lat: 25.0340, lng: 121.5644 },
  { lat: 25.0320, lng: 121.5664 },
  { lat: 25.0310, lng: 121.5674 },
  { lat: 25.0350, lng: 121.5634 },
  { lat: 25.0360, lng: 121.5624 },
  { lat: 25.0370, lng: 121.5614 },
  { lat: 25.0380, lng: 121.5604 },
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

  const options = {
    averageCenter: true,
    minimumClusterSize: 2,
    styles: [
      {
        url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png",
        width: 53,
        height: 53,
        textColor: '#fff',
        textSize: 16,
        anchorText: [0, 0]
      },
      {
        url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m2.png",
        width: 56,
        height: 56,
        textColor: '#fff',
        textSize: 16,
        anchorText: [0, 0]
      },
      {
        url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png",
        width: 66,
        height: 66,
        textColor: '#fff',
        textSize: 16,
        anchorText: [0, 0]
      },
      {
        url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m4.png",
        width: 78,
        height: 78,
        textColor: '#fff',
        textSize: 16,
        anchorText: [0, 0]
      },
      {
        url: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m5.png",
        width: 90,
        height: 90,
        textColor: '#fff',
        textSize: 16,
        anchorText: [0, 0]
      }
    ],
    // 移除之前的 renderer 設定，因為現在使用預設的圖標渲染
  };

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
      >
        <MarkerClustererF
          options={options}
        >
          {(clusterer) =>
            locations.map((location, index) => (
              <MarkerF
                key={index}
                position={location}
                clusterer={clusterer}
                onClick={() => console.log(`Clicked marker ${index}`)}
              />
            ))
          }
        </MarkerClustererF>
      </GoogleMap>
    </div>
  );
};

export default SampleMap;
