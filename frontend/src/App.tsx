import './App.css'
import Hero from './components/hero/Hero';
import 'leaflet/dist/leaflet.css';
import MapSection from './components/mapSection/MapSection';
import { MapProvider } from './context/MapContext';

function App() {
	return (
		<div className="content-grid my-16">
			<Hero />
			<MapProvider>
				<MapSection />
			</MapProvider>
		</div>
	);
}

export default App
