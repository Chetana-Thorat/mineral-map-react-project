import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Tooltip, LayersControl, ZoomControl } from 'react-leaflet';
import Papa from 'papaparse';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MineralMap.css';




// Mineral color mapping
const mineralColors = {
  Lithium: '#FFAA1D',   // Bright Yellow
  Copper: '#00008B',    // Dark Blue
  Cobalt: '#FF4500',    // Orange Red
  Nickel: '#32CD32',    // Lime Green
  Graphite: '#8A2BE2',  // Blue Violet
  Other: '#A52A2A'      // Brown
};

// Project status shape mapping
const statusShapes = {
  Exploration: 'circle',
  Development: 'square',
  'Delayed Indefinitely': 'triangle',
  Active: 'star',
  'Active -- Expansion Plan': 'diamond',
  'Active -- No Expansion Plan': 'hexagon',
};

// SVG shape generator
const createShapeIcon = (color, shape) => {
  let svgShape = '';
  switch (shape) {
    case 'square':
      svgShape = `<rect x="2" y="2" width="16" height="16" fill="${color}" stroke="white" stroke-width="1"/>`; break;
    case 'triangle':
      svgShape = `<polygon points="10,2 18,18 2,18" fill="${color}" stroke="white" stroke-width="1"/>`; break;
    case 'star':
      svgShape = `<polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7" fill="${color}" stroke="white" stroke-width="1"/>`; break;
    case 'diamond':
      svgShape = `<polygon points="10,2 18,10 10,18 2,10" fill="${color}" stroke="white" stroke-width="1"/>`; break;
    case 'hexagon':
      svgShape = `<polygon points="6,2 14,2 18,10 14,18 6,18 2,10" fill="${color}" stroke="white" stroke-width="1"/>`; break;
    default:
      svgShape = `<circle cx="10" cy="10" r="8" fill="${color}" stroke="white" stroke-width="1"/>`;
  }

  return L.divIcon({
    className: 'custom-div-icon',
    html: `<svg width="20" height="20" viewBox="0 0 20 20">${svgShape}</svg>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

function MineralMap() {
  const [data, setData] = useState([]);
  const [selectedMineral, setSelectedMineral] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLandOwnership, setSelectedLandOwnership] = useState('All');
  const navigate = useNavigate();

  const mainMinerals = ['Lithium', 'Copper', 'Cobalt', 'Nickel', 'Graphite'];

  useEffect(() => {
    Papa.parse('/minerals_with_coords.csv', {
      header: true,
      download: true,
      complete: (results) => {
        const valid = results.data.filter(d => d.Latitude && d.Longitude);
        setData(valid);
      }
    });
  }, []);

  const filteredData = data.filter(item => {
    const mineralMatch = selectedMineral === 'All' ||
      (selectedMineral === 'Other' ? !mainMinerals.includes(item.Primary_Critical_Material) : item.Primary_Critical_Material === selectedMineral);
    const statusMatch = selectedStatus === 'All' || item.Status_of_Project === selectedStatus;
    const landMatch = selectedLandOwnership === 'All' || item.Type_of_Land === selectedLandOwnership;
    return mineralMatch && statusMatch && landMatch;
  });
  

  return (
    <div className="map-wrapper">
      <MapContainer center={[39.5, -98.35]} zoom={5} style={{ height: '100vh', width: '100%' }} zoomControl={false}>
        <LayersControl position="topleft">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Light Minimal">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          </LayersControl.BaseLayer>
          
        </LayersControl>
        <ZoomControl position="topleft" />

        {filteredData.map((item, index) => {
          const mineral = mainMinerals.includes(item.Primary_Critical_Material)
            ? item.Primary_Critical_Material
            : 'Other';
          const color = mineralColors[mineral];
          const shape = statusShapes[item.Status_of_Project] || 'circle';
          const icon = createShapeIcon(color, shape);

          return (
            <Marker
            key={index}
            position={[item.Latitude, item.Longitude]}
            icon={icon}
            eventHandlers={{ click: () => navigate(`/mineral/${index}`) }}
            title=""  // Explicitly set an empty title
          >
            <Tooltip 
              direction="top" 
              offset={[0, -10]} 
              opacity={1}
              permanent={false}  // Prevents the tooltip from being always visible
            >
              <div style={{ maxWidth: '250px' }}>
                <strong>Material:</strong> {item.Primary_Critical_Material}<br />
                <strong>Status:</strong> {item.Status_of_Project}<br />
                <strong>Project:</strong> {item.Project_Name}<br />
                <strong>Developer:</strong> {item.Lead_Developer}
              </div>
            </Tooltip>
          </Marker>

          );
        })}
      </MapContainer>

      {/* Legends and Filters */}
      <div className="legend">
        <h4>Mineral Legend</h4>
        {Object.entries(mineralColors).map(([name, hex]) => (
          <div key={name} className="legend-item">
            <div className="dot" style={{ backgroundColor: hex }}></div>
            <span>{name}</span>
          </div>
        ))}

        <h4>Status Legend</h4>
        {Object.entries(statusShapes).map(([status, shape]) => (
          <div key={status} className="legend-item">
            <div dangerouslySetInnerHTML={{
              __html: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                ${createShapeIcon('#333', shape).options.html.match(/<svg.*<\/svg>/)[0]}
              </svg>`
            }} />
            <span>{status}</span>
          </div>
        ))}

        <div className="filters">
          <select value={selectedMineral} onChange={(e) => setSelectedMineral(e.target.value)}>
            <option value="All">All Minerals</option>
            {mainMinerals.map(mineral => (
              <option key={mineral} value={mineral}>{mineral}</option>
            ))}
            <option value="Other">Other</option>
          </select>

          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="All">All Status</option>
            {Object.keys(statusShapes).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select value={selectedLandOwnership} onChange={(e) => setSelectedLandOwnership(e.target.value)}>
            <option value="All">All Types of Land</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Public and Private">Public and Private</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default MineralMap;
