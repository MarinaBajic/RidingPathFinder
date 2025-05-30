import './App.css'
import Hero from './components/hero/Hero';
import 'leaflet/dist/leaflet.css';
import MapSection from './components/mapSection/MapSection';
import Footer from './components/footer/Footer';

function App() {
	return (
		<div className="content-grid">
			<Hero />
			<MapSection />
			<Footer />
		</div>
	);
}

export default App
