import './App.css'
import Hero from './components/hero/Hero';
import Map from './components/map/Map';
import 'leaflet/dist/leaflet.css';

function App() {
  return (
		<div className="content-grid my-16">
			<Hero />
			<Map />
		</div>
  );
}

export default App
