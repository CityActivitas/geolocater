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
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
  const [savedLocations, setSavedLocations] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);

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
          lng: latLng.lng,
          timestamp: new Date().toLocaleString(),
          notes: ''
        };

        setCurrentLocation(location);
        setIsDialogOpen(true);
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
        map.panTo(location);
        setMarker({
          lat: location.lat(),
          lng: location.lng()
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

  const saveLocation = () => {
    setSavedLocations(prev => [...prev, currentLocation]);
    setIsDialogOpen(false);
    toast({
      title: "成功",
      description: "已儲存位置",
    });
  };

  const removeLocation = (index) => {
    setSavedLocations(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "成功",
      description: "已刪除位置",
    });
  };

  const copyCoordinates = (lat, lng) => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    toast({
      title: "已複製",
      description: "座標已複製到剪貼簿",
    });
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

          <Separator className="my-4" />

          {/* 已儲存的位置列表 */}
          <div>
            <h3 className="text-lg font-semibold mb-2">已儲存的位置</h3>
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {savedLocations.length === 0 ? (
                <p className="text-gray-500 text-center">尚未儲存任何位置</p>
              ) : (
                <div className="space-y-4">
                  {savedLocations.map((location, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {index + 1}
                          </Badge>
                          <p className="font-medium">{location.address}</p>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p
                                className="text-sm text-gray-500 mt-1 cursor-pointer hover:text-gray-700"
                                onClick={() => copyCoordinates(location.lat, location.lng)}
                              >
                                <span className="flex items-center gap-1">
                                  <Copy className="h-3 w-3" />
                                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                </span>
                              </p>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>點擊複製座標</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <p className="text-xs text-gray-400 mt-1">{location.timestamp}</p>
                        {location.notes && (
                          <p className="text-sm text-gray-600 mt-1">{location.notes}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLocation(index)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>儲存位置</DialogTitle>
            <DialogDescription>
              確認是否要儲存這個位置？您可以加入備註。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>地址</Label>
              <p className="text-sm text-gray-500">{currentLocation?.address}</p>
            </div>

            <div className="space-y-2">
              <Label>座標</Label>
              <p className="text-sm text-gray-500">
                {currentLocation?.lat.toFixed(6)}, {currentLocation?.lng.toFixed(6)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">備註</Label>
              <Input
                id="notes"
                value={currentLocation?.notes || ''}
                onChange={(e) => setCurrentLocation(prev => ({
                  ...prev,
                  notes: e.target.value
                }))}
                placeholder="輸入備註（選填）"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={saveLocation}>
              儲存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationPicker;