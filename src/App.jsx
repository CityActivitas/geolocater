import { useState } from 'react'
import SampleMap from './components/SampleMap'
import LocationPicker from './components/LocationPicker'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

if (!apiKey) {
  console.error('Google Maps API key is missing')
}

function App() {
  const [activeView, setActiveView] = useState('location') // 'location' 或 'sample'

  return (
    <div className='max-w-[1024px] mx-auto mt-4'>
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${activeView === 'location' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveView('location')}
        >
          位置選擇器
        </button>
        <button
          className={`px-4 py-2 rounded ${activeView === 'sample' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveView('sample')}
        >
          範例地圖
        </button>
      </div>

      {activeView === 'location' ? (
        <LocationPicker apiKey={apiKey} />
      ) : (
        <SampleMap />
      )}
    </div>
  )
}

export default App
