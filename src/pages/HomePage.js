import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './HomePage.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const glossary = [
  { term: "Lithium", definition: "A critical mineral used in electric vehicle batteries and energy storage systems." },
  { term: "Project Status", definition: "Describes the development phase: Exploration, Development, Active, etc." },
  { term: "Type of Land", definition: "Indicates whether the mineral project is on public, private, or mixed land." },
  { term: "Exploration Phase", definition: "The initial stage of a mining project, involving surveys and assessments." },
  { term: "Critical Minerals", definition: "Minerals essential to the economy and national security, with vulnerable supply chains." },
  { term: "Rare Earth Elements", definition: "A group of 17 chemically similar elements used in high-tech devices, defense, and clean energy." } 
];

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="homepage">
      <header className="hero" data-aos="fade-down">
        <div className="hero-content">
          <h1>Unlock Critical Mineral Insights Across the U.S.</h1>
          <p>Explore data-driven insights on strategic mineral resources.</p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/map')}>Explore Interactive Map</button>
            <button onClick={() => navigate('/search')}>Search Projects</button>
          </div>
        </div>
      </header>


      <section className="map-preview-horizontal" data-aos="fade-right">
        <div className="map-preview-container">
          <div className="map-preview-text">
            <h2>Mini Map Preview</h2>
            <p>
              Discover and interact with a visual snapshot of strategic mineral projects
              across the U.S. Click below to explore the full interactive map with over 200+ projects.
            </p>
            <button className="map-button" onClick={() => navigate('/map')}>
              Explore Full Map
            </button>
          </div>

          <div className="map-preview-map">
          <MapContainer
            center={[39.5, -98.35]}
            zoom={4}
            scrollWheelZoom={true}
            dragging={true}
            doubleClickZoom={true}
            zoomControl={true}
            attributionControl={false}
            style={{ height: '420px', width: '100%', borderRadius: '12px' }}
          >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
          </div>
        </div>
      </section>


      {/* About Section */}
      <section id="about" className="about-section" data-aos="fade-up">
        <div className="about-container">
          <h2>About the Project</h2>
          <p>
            DEV-CaMP is an initiative dedicated to cataloging and visualizing U.S. mineral projects.
            It supports researchers and policymakers with data-driven insights into current projects nationwide.
          </p>
        </div>
      </section>

      {/* Glossary Section */}
      <section id="glossary" className="glossary-section" data-aos="fade-up">
        <h2>Glossary</h2>
        <div className="glossary-grid">
          {glossary.map((item, index) => (
            <div key={index} className="glossary-card">
              <h4>{item.term}</h4>
              <p>{item.definition}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / Contact Section */}
      <footer id="contact" className="site-footer" data-aos="fade-up">
        <div className="footer-content">
          <p>© 2025 <strong>Chetana Thorat</strong> | Indiana University Bloomington</p>
          <div className="footer-links">
            <a href="https://www.linkedin.com/in/chetanathorat" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com/chetanathorat" target="_blank" rel="noreferrer">GitHub</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
          <p className="footer-support">Supported by DEV-CaMP</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;