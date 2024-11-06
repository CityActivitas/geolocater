import { useState } from 'react'
import SampleMap from './components/SampleMap'
import LocationPicker from './components/LocationPicker'
import CaseTrackingMap from './components/CaseTrackingMap'

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

if (!apiKey) {
  console.error('Google Maps API key is missing')
}

function App() {
  const [activeView, setActiveView] = useState('location') // 'location' 或 'sample'

  const renderActiveView = () => {
    const viewComponents = {
      location: <LocationPicker apiKey={apiKey} />,
      sample: <SampleMap />,
      default: <CaseTrackingMap />
    };
  
    return viewComponents[activeView] || viewComponents.default;
  };

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
        <button
          className={`px-4 py-2 rounded ${activeView === 'casetracking' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveView('casetracking')}
        >
          案例追蹤地圖
        </button>
      </div>

      <div>
        {renderActiveView()}
      </div>

    </div>
  )
}

export default App
