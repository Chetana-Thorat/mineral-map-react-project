import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProjectsPage.css';
import Papa from 'papaparse';

const mineralList = [
  'Lithium', 'Copper', 'Cobalt',
  'Nickel', 'Graphite', 'Neodymium',
  'Manganese'
];

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredMineral, setFilteredMineral] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/cleaned_DevCamp_new.csv')
      .then(response => response.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setProjects(results.data);
          }
        });
      });
  }, []);

  const handleMineralClick = (mineral) => {
    setFilteredMineral(mineral);
    setSearchTerm('');
  };

  const clearAll = () => {
    setFilteredMineral(null);
    setSearchTerm('');
  };

  const filteredProjects = projects.filter((p) => {
    const name = p["Project_Name"]?.toLowerCase().trim();
    const mineral = p["Primary_Critical_Material"]?.trim();

    const matchesSearch = searchTerm === "" || name?.includes(searchTerm.toLowerCase());
    const matchesMineral = !filteredMineral || mineral === filteredMineral;

    return matchesSearch && matchesMineral;
  });

  return (
    <div className="projects-split-page">
      {/* Left Panel */}
      <div className="projects-left-panel">
        <h1>Explore Projects by Mineral</h1>
        <p className="projects-subtext">Search or select a mineral to explore U.S. critical material projects.</p>
        <input
          type="text"
          placeholder="Search projects by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setFilteredMineral(null);
          }}
          className="projects-search-input"
        />
      </div>

      {/* Right Panel */}
      <div className="projects-right-panel">
        <div className="vertical-mineral-list">
          {mineralList.map((mineral) => (
            <div
              key={mineral}
              className={`vertical-mineral-box ${filteredMineral === mineral ? 'active' : ''}`}
              onClick={() => handleMineralClick(mineral)}
            >
              {mineral}
            </div>
          ))}
          <button className="clear-btn-right" onClick={clearAll}>Clear All</button>
        </div>

        {(filteredMineral || searchTerm) && (
          <div className="project-section">
            <h2>{filteredMineral || 'Search Results'} Projects</h2>

            {filteredProjects.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'gray' }}>No projects found.</p>
            ) : (
              <div className="project-list">
                {filteredProjects.map((project, index) => {
                  const encodedName = encodeURIComponent(project.Project_Name?.trim());
                  return (
                    <Link
                      to={`/mineral/${encodedName}`}
                      key={index}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="project-card">
                        <h3>{project.Project_Name}</h3>
                        <p><strong>Mineral:</strong> {project["Primary_Critical_Material"]}</p>
                        <p><strong>Status:</strong> {project.Status_of_Project}</p>
                        <p>
                          <strong>Location:</strong>{' '}
                          {project.State
                            ? project.County
                              ? `${project.County}, ${project.State}`
                              : project.State
                            : 'Location not available'}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
