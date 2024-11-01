import React, { useState } from 'react';
import { GoogleMap, useLoadScript, MarkerF, PolygonF } from '@react-google-maps/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '384px',
};

const center = {
  lat: 22.9908,  // 台南市政府
  lng: 120.2133
};

const locations = [
  { lat: 22.9908, lng: 120.2133, name: "台南市政府" },
  { lat: 22.9997, lng: 120.2270, name: "台南火車站" },
  { lat: 23.0027, lng: 120.2078, name: "赤崁樓" },
  { lat: 22.9919, lng: 120.1970, name: "安平古堡" },
  { lat: 22.9885, lng: 120.2033, name: "林百貨" },
  { lat: 22.9946, lng: 120.2036, name: "神農街" },
  { lat: 22.9843, lng: 120.1974, name: "安平老街" },
  { lat: 23.0015, lng: 120.2198, name: "台南美術館" },
];

// 修改多邊形的設定和資訊
const polygonInfo = {
  name: "台南市中心商圈",
  description: "包含中正路、西門路、民權路等主要商圈",
  bounds: [
    { lat: 22.9958, lng: 120.2083 },
    { lat: 22.9958, lng: 120.2183 },
    { lat: 22.9858, lng: 120.2183 },
    { lat: 22.9858, lng: 120.2083 },
  ]
};

const polygonOptions = {
  fillColor: "#FF0000",      // 填充顏色
  fillOpacity: 0.35,         // 填充透明度
  strokeColor: "#FF0000",    // 邊框顏色
  strokeOpacity: 1,          // 邊框透明度
  strokeWeight: 2,           // 邊框寬度
  clickable: true,           // 設為可點擊
  editable: false,           // 設為不可編輯
  draggable: false,          // 設為不可拖動
  zIndex: 1                  // 圖層層級
};

const SampleMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // 處理標記點擊
  const handleMarkerClick = async (location) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat: location.lat, lng: location.lng }
      });

      setSelectedLocation({
        type: 'marker',
        ...location,
        address: response.results?.[0]?.formatted_address || '無法取得地址'
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      setSelectedLocation({
        type: 'marker',
        ...location,
        address: '無法取得地址'
      });
    }
  };

  // 處理多邊形點擊
  const handlePolygonClick = async () => {
    // 計算多邊形中心點
    const centerLat = (polygonInfo.bounds[0].lat + polygonInfo.bounds[2].lat) / 2;
    const centerLng = (polygonInfo.bounds[0].lng + polygonInfo.bounds[2].lng) / 2;

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat: centerLat, lng: centerLng }
      });

      setSelectedLocation({
        type: 'polygon',
        name: polygonInfo.name,
        description: polygonInfo.description,
        address: response.results?.[0]?.formatted_address || '無法取得地址',
        lat: centerLat,
        lng: centerLng
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      setSelectedLocation({
        type: 'polygon',
        name: polygonInfo.name,
        description: polygonInfo.description,
        address: '無法取得地址',
        lat: centerLat,
        lng: centerLng
      });
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div className="w-full max-w-[1024px] mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            地圖
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96 rounded-lg overflow-hidden mb-4">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={13}
              center={center}
            >
              {locations.map((location, index) => (
                <MarkerF
                  key={index}
                  position={location}
                  onClick={() => handleMarkerClick(location)}
                  title={location.name}
                />
              ))}

              <PolygonF
                paths={polygonInfo.bounds}
                options={polygonOptions}
                onClick={handlePolygonClick}
              />
            </GoogleMap>
          </div>

          {/* 位置資訊顯示區域 */}
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">位置資訊</h3>
            {selectedLocation ? (
              <div className="space-y-2">
                <div>
                  <Label className="text-sm font-medium">名稱</Label>
                  <p className="text-sm text-gray-600">{selectedLocation.name}</p>
                </div>
                {selectedLocation.type === 'polygon' && (
                  <div>
                    <Label className="text-sm font-medium">說明</Label>
                    <p className="text-sm text-gray-600">{selectedLocation.description}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">地址</Label>
                  <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">GPS 座標</Label>
                  <p className="text-sm text-gray-600">
                    {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">點選標記或區域以顯示位置資訊</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SampleMap;
