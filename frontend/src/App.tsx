import './App.css'
import Hero from './components/hero/Hero';
import 'leaflet/dist/leaflet.css';
import MapSection from './components/mapSection/MapSection';

function App() {
  return (
		<div className="content-grid my-16">
			<Hero />
			<MapSection />
		</div>
  );
}

export default App
