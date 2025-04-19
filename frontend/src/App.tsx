import './App.css'
import Hero from './components/hero/Hero';
import 'leaflet/dist/leaflet.css';
import MapSection from './components/mapSection/MapSection';
import { WaypointProvider } from './context/WaypointContext';

function App() {
	return (
		<div className="content-grid my-16">
			<Hero />
			<WaypointProvider>
				<MapSection />
			</WaypointProvider>
		</div>
	);
}

export default App
