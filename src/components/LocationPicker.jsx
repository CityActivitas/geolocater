// LocationPicker.js
import React, { useState } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, MapPin, Copy, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const libraries = ['places', 'geocoding'];

const mapContainerStyle = {
  width: '100%',
  height: '384px',
};

const center = {
  lat: 25.0330,
  lng: 121.5654
};

const LocationPicker = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { toast } = useToast();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleMapClick = async (event) => {
    const latLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };

    setMarker(latLng);

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: latLng });

      if (response.results[0]) {
        const location = {
          address: response.results[0].formatted_address,
          lat: latLng.lat,
          lng: latLng.lng
        };
        setSelectedLocation(location);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "無法取得地址資訊",
      });
    }
  };

  const searchLocation = async () => {
    if (!searchInput.trim()) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "請輸入搜尋地址",
      });
      return;
    }

    try {
      setLoading(true);
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ address: searchInput });

      if (response.results[0]) {
        const location = response.results[0].geometry.location;
        const latLng = {
          lat: location.lat(),
          lng: location.lng()
        };

        // 更新地圖位置和標記
        map.panTo(location);
        setMarker(latLng);

        // 更新選中的位置資訊
        setSelectedLocation({
          address: response.results[0].formatted_address,
          lat: latLng.lat,
          lng: latLng.lng
        });
      } else {
        toast({
          variant: "destructive",
          title: "錯誤",
          description: "找不到該地址",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        variant: "destructive",
        title: "錯誤",
        description: "搜尋過程發生錯誤",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadError) return <Alert variant="destructive"><AlertDescription>地圖載入失敗</AlertDescription></Alert>;
  if (!isLoaded) return <div>載入中...</div>;

  return (
    <div className="w-full max-w-[1024px] mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            地點選擇器
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                placeholder="輸入地址或地區"
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button onClick={searchLocation} disabled={loading}>
              {loading ? "搜尋中..." : "搜尋"}
            </Button>
          </div>

          <div className="w-full h-96 rounded-lg overflow-hidden mb-4">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={13}
              center={center}
              onLoad={setMap}
              onClick={handleMapClick}
            >
              {marker && (
                <MarkerF
                  position={marker}
                />
              )}
            </GoogleMap>
          </div>

          {selectedLocation && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">位置資訊</h3>
              <div className="space-y-2">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationPicker;