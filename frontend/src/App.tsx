import './App.css'
import Hero from './components/Hero';
import Map from './components/Map';
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
