import React from 'react';
import { GoogleMap, useLoadScript, MarkerF, PolygonF } from '@react-google-maps/api';

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

// 定義四邊形的座標
const polygonPath = [
  { lat: 25.0340, lng: 121.5644 },
  { lat: 25.0340, lng: 121.5754 },
  { lat: 25.0240, lng: 121.5754 },
  { lat: 25.0240, lng: 121.5644 },
];

const polygonOptions = {
  fillColor: "#FF0000",      // 填充顏色
  fillOpacity: 0.35,         // 填充透明度
  strokeColor: "#FF0000",    // 邊框顏色
  strokeOpacity: 1,          // 邊框透明度
  strokeWeight: 2,           // 邊框寬度
  clickable: false,          // 設為不可點擊
  editable: false,           // 設為不可編輯
  draggable: false,          // 設為不可拖動
  zIndex: 1                  // 圖層層級
};

const SampleMap = () => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
      >
        {/* 原有的標記點 */}
        {locations.map((location, index) => (
          <MarkerF
            key={index}
            position={location}
            onClick={() => console.log(`Clicked marker ${index}`)}
          />
        ))}

        {/* 固定的四邊形 */}
        <PolygonF
          paths={polygonPath}
          options={polygonOptions}
        />
      </GoogleMap>
    </div>
  );
};

export default SampleMap;
