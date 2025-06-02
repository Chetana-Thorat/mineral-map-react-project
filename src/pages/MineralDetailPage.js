import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import './MineralDetailPage.css';

function MineralDetailPage() {
  const { id } = useParams();
  const [mineral, setMineral] = useState(null);
  const [noteMap, setNoteMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');  // State for search term
  const navigate = useNavigate();
  const notesRef = useRef(null);

  useEffect(() => {
    // Load primary mineral data
    Papa.parse('/minerals_with_coords.csv', {
      header: true,
      download: true,
      complete: (results) => {
        const all = results.data.filter(row => row.Latitude && row.Longitude);
        if (id >= 0 && id < all.length) {
          setMineral(all[id]);
        }
      }
    });

    // Load notes data
    Papa.parse('/minerals_backup_data.csv', {
      header: false,
      skipEmptyLines: true,
      download: true,
      complete: (results) => {
        const rows = results.data;
        const header = rows[0];
        const mineIndex = header.findIndex(col => col.trim().toLowerCase() === 'mine/prospect');
        const noteIndex = header.findIndex(col => col.trim().toLowerCase() === 'notes');

        const mapping = {};
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const mine = row[mineIndex]?.trim();
          const note = row[noteIndex]?.trim();
          if (mine && note) {
            mapping[mine] = note;
          }
        }
        setNoteMap(mapping);
      }
    });
  }, [id]);

  if (!mineral) return <div className="loading">Loading...</div>;

  const matchingKey = mineral.Project_Name?.trim();
  const note = noteMap[matchingKey];

  const scrollToNotes = () => {
    if (notesRef.current) {
      notesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filter fields based on the search term
  const filteredFields = Object.entries(mineral).filter(([key, value]) =>
    key.toLowerCase().includes(searchTerm) || String(value).toLowerCase().includes(searchTerm)
  );

  
  // Helper function to structure notes dynamically
  // Helper function to structure notes dynamically
  const formatNotes = (rawNote) => {
    if (!rawNote) return 'No notes available.';

    const sectionHeaders = [
      "Location", "Project Description", "Developer Description", "Economic Impact",
      "Financial Support", "Support Statements", "Concerns", "Reasons for", 
      "Commercial Plans", "Land Ownership", "Community Impact", "Environmental Impact"
    ];

    // Regular expression to find phrases like "Lead Developer:", "Parent Company:", etc.
    const headingRegex = /(\b[A-Z][\w\s/]*:)/g;

    const regex = new RegExp(`(${sectionHeaders.join('|')}):`, 'g');
    const sections = rawNote.split(regex).filter(Boolean);

    const structuredNotes = [];
    for (let i = 0; i < sections.length; i += 2) {
      const title = sections[i]?.trim() || 'Unknown';
      let content = sections[i + 1]?.trim() || 'No data available.';

      // Ensure content is a string before applying replace
      if (typeof content === 'string') {
        // Make headings at the beginning of each line bold
        content = content.replace(headingRegex, '<strong>$1</strong>');
      }

      structuredNotes.push(
        <div key={i} className="note-section">
          <h3>{title}:</h3>
          <p dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }

    return structuredNotes;
  };

  return (
    <div className="mineral-detail">
      <button className="back-btn" onClick={() => navigate('/map')}>← Back to Map</button>

      <div className="header-row">
        <h1>{mineral.Project_Name}</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search fields..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-bar improved-search"
          />
          <button className="scroll-btn" onClick={scrollToNotes}>Additional Info ⬇</button>
        </div>
      </div>

      <div className="grid">
        {filteredFields.map(([key, value]) => {
          // Check if the value is a valid URL
          const isUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));

          return (
            <div className="field" key={key}>
              <strong>{key.replaceAll('_', ' ')}:</strong>
              {isUrl ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="link-box">
                  {value}
                </a>
              ) : (
                ` ${value || 'N/A'}`
              )}
            </div>
          );
        })}
      </div>


      {/* Notes Section */}
      <div className="notes-section" ref={notesRef}>
        <h2>Additional Notes</h2>
        {note ? formatNotes(note) : <p>No additional notes found.</p>}
      </div>
    </div>
  );
}

export default MineralDetailPage;
