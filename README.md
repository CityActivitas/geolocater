# 台南地圖定位系統

主要用來測試 [@react-google-maps/api](https://github.com/JustFly1984/react-google-maps-api) 套件, 並且驗證如果製作地圖工具會用到的功能


## 主要功能

位置選擇器: 
- 地點搜尋：使用者可以輸入地址或地標進行搜尋
- 地圖標記：點擊地圖任意位置可以標記該點
- 地址反查：自動顯示所選位置的詳細地址和 GPS 座標

 範例地圖: 
- 標記：顯示預設標記的位置
- 查詢：點選標記或區域，顯示詳細資訊

## 使用技術

- React 18
- Vite
- Google Maps JavaScript API
- @react-google-maps/api
- Tailwind CSS
- shadcn/ui 元件庫

## 使用方式

1. 在搜尋框輸入想要尋找的地址或地標
2. 點擊搜尋按鈕或按下 Enter 鍵進行搜尋
3. 可直接點擊地圖上的任意位置來標記
4. 系統會自動顯示所選位置的詳細地址和 GPS 座標資訊

## 注意事項

使用前請確保已設定有效的 Google Maps API 金鑰於環境變數中：

.env: 

```
VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
```

## 安裝與執行

```
npm install
npm run dev
```
