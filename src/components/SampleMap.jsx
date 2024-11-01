import React, { useState } from 'react';
import { GoogleMap, useLoadScript, MarkerF, PolygonF } from '@react-google-maps/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '384px',
};

// 修改 center 位置到台灣
const center = {
  lat: 25.0330,  // 台北市中心附近
  lng: 121.5654
};

// 增加更多測試位置點
const locations = [
  { lat: 25.0330, lng: 121.5654, name: "台北車站" },
  { lat: 25.0340, lng: 121.5644, name: "台北捷運站" },
  { lat: 25.0320, lng: 121.5664, name: "台北101" },
  { lat: 25.0310, lng: 121.5674, name: "信義商圈" },
  { lat: 25.0350, lng: 121.5634, name: "西門町" },
  { lat: 25.0360, lng: 121.5624, name: "龍山寺" },
  { lat: 25.0370, lng: 121.5614, name: "中正紀念堂" },
  { lat: 25.0380, lng: 121.5604, name: "台北市政府" },
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

// 搜尋框樣式
const searchBoxStyle = {
  position: 'absolute',
  top: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '300px',
  zIndex: 10,
};

const searchInputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  backgroundColor: 'white',     // 白色背景
  color: 'black',              // 黑色文字
  fontSize: '16px',            // 適當的字體大小
  outline: 'none',             // 移除focus時的外框
};

const searchResultsStyle = {
  position: 'absolute',
  top: '100%',
  left: '0',
  right: '0',
  backgroundColor: 'white',    // 白色背景
  border: '1px solid #ccc',
  borderTop: 'none',
  borderRadius: '0 0 5px 5px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
  maxHeight: '200px',
  overflowY: 'auto',
};

const searchResultItemStyle = {
  padding: '10px',
  cursor: 'pointer',
  borderBottom: '1px solid #eee',
  color: 'black',              // 黑色文字
  backgroundColor: 'white',    // 白色背景
  '&:hover': {
    backgroundColor: '#f5f5f5' // 淺灰色懸停效果
  }
};

const SampleMap = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // 過濾搜尋結果
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 處理搜尋結果點擊
  const handleLocationSelect = (location) => {
    if (map) {
      map.panTo({ lat: location.lat, lng: location.lng });
      map.setZoom(16);
      setSearchTerm('');
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
          <div style={{ position: 'relative' }}>
            {/* 搜尋框 */}
            <div style={searchBoxStyle}>
              <input
                type="text"
                placeholder="搜尋地點..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={searchInputStyle}
              />
              {searchTerm && (
                <div style={searchResultsStyle}>
                  {filteredLocations.map((location, index) => (
                    <div
                      key={index}
                      onClick={() => handleLocationSelect(location)}
                      style={searchResultItemStyle}
                    >
                      {location.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={13}
              center={center}
              onLoad={setMap}
            >
              {/* 標記點 */}
              {locations.map((location, index) => (
                <MarkerF
                  key={index}
                  position={location}
                  onClick={() => console.log(`Clicked: ${location.name}`)}
                  title={location.name}
                />
              ))}

              {/* 四邊形 */}
              <PolygonF
                paths={polygonPath}
                options={polygonOptions}
              />
            </GoogleMap>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SampleMap;
