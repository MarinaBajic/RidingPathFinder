import './App.css'
import Hero from './components/hero/Hero';
import 'leaflet/dist/leaflet.css';
import MapSection from './components/mapSection/MapSection';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';

function App() {
	return (
		<div className="content-grid">
			<Header />
			<Hero />
			<MapSection />
			<Footer />
		</div>
	);
}

export default App
