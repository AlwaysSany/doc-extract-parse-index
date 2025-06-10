import React, { useState } from 'react';
import './App.css';

function App() {
  // State for file upload
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadResults, setUploadResults] = useState([]);
  const [uploading, setUploading] = useState(false);

  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notification, setNotification] = useState(null); // { message: '...', type: 'success/error/info' }

  // Helper to get backend URL (adjust if needed)
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFiles.length) return;
    setUploading(true);
    setUploadResults([]);
    const formData = new FormData();
    for (let file of selectedFiles) {
      formData.append('files', file);
    }
    try {
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setUploadResults(data.results || []);
        const successCount = data.results.filter(r => r.status === 'success').length;
        if (successCount > 0) {
          showNotification(`${successCount} document(s) uploaded successfully!`, 'success');
        }
        const errorCount = data.results.filter(r => r.status === 'error').length;
        if (errorCount > 0) {
          showNotification(`${errorCount} document(s) failed to upload.`, 'error');
        }
      } else {
        // Not JSON, likely an error page
        const text = await res.text();
        setUploadResults([{ status: 'error', error: 'Server error: ' + text.slice(0, 100) }]);
        showNotification('Server error during upload. Please check console.', 'error');
      }
    } catch (err) {
      setUploadResults([{ status: 'error', error: err.message }]);
      showNotification(`Network error during upload: ${err.message}`, 'error');
    }
    setUploading(false);
  };

  // Show notification message
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000); // Notification disappears after 5 seconds
  };

  // Debounce function
  const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  // Fetch suggestions from backend
  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/suggest?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  // Handle search input change for suggestions
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      debouncedFetchSuggestions(query);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle clicking a suggestion
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    // Trigger search immediately after selecting a suggestion
    handleSearch({ preventDefault: () => { } });
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      showNotification('Please enter a search query.', 'info');
      return;
    }
    console.log('Search query:', searchQuery);
    setSearching(true);
    setSearchResults([]);
    try {
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(searchQuery)}`);
      const contentType = res.headers.get('content-type');
      console.log('Response content type:', contentType);
      console.log('Response status:', res);
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        console.log('Search results:', data);
        setSearchResults(data.results || []);
        showNotification(`Found ${data.results.length} results.`, 'info');
      } else {
        setSearchResults([]);
        showNotification('Server error during search. Please check console.', 'error');
      }
    } catch (err) {
      setSearchResults([]);
      showNotification(`Network error during search: ${err.message}`, 'error');
    }
    setSearching(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: 'Inter, Arial, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: 800,
        margin: '40px auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        padding: 40,
        border: '1px solid #e2e8f0'
      }}>
        <h1 style={{
          textAlign: 'center',
          fontWeight: 800,
          color: '#2d3748',
          marginBottom: 32,
          fontSize: '2.5rem'
        }}>
          Document Extractor
        </h1>

        {/* Notification Display */}
        {notification && (
          <div style={{
            position: 'fixed',
            top: 20,
            right: 20,
            background: notification.type === 'success' ? '#48bb78' :
              notification.type === 'error' ? '#f56565' :
                '#4299e1',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            fontSize: '1rem',
            fontWeight: 600,
            opacity: 0.95,
            animation: 'fadeIn 0.3s ease-out, fadeOut 0.5s ease-in 4.5s forwards'
          }}>
            {notification.message}
            <style>
              {`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 0.95; transform: translateY(0); }
              }
              @keyframes fadeOut {
                from { opacity: 0.95; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
              }
              `}
            </style>
          </div>
        )}

        {/* Upload Interface */}
        <section style={{ marginBottom: 48, position: 'relative' }}>
          <h2 style={{
            color: '#4a5568',
            fontWeight: 700,
            marginBottom: 24,
            fontSize: '1.8rem'
          }}>Upload Documents</h2>
          <form onSubmit={handleUpload} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #a0aec0',
                borderRadius: 10,
                background: '#edf2f7',
                fontSize: '1rem',
                color: '#2d3748',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#3182ce'}
              onBlur={e => e.target.style.borderColor = '#a0aec0'}
            />
            <button
              type="submit"
              disabled={uploading}
              style={{
                background: uploading ? '#a0aec0' : '#3182ce',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '12px 32px',
                fontWeight: 700,
                cursor: uploading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s, transform 0.1s',
                fontSize: '1.1rem'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
          {uploading && (
            <div style={{
              position: 'absolute',
              bottom: -20,
              left: 0,
              right: 0,
              height: 4,
              background: '#e2e8f0',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: '#3182ce',
                transformOrigin: '0% 50%',
                animation: 'progress-indeterminate 1.5s ease-in-out infinite'
              }}></div>
            </div>
          )}
          <style>
            {`
            @keyframes progress-indeterminate {
              0% {
                transform: translateX(-100%) scaleX(0);
              }
              50% {
                transform: translateX(0%) scaleX(0.7);
              }
              100% {
                transform: translateX(100%) scaleX(0);
              }
            }
            `}
          </style>
          {uploadResults.length > 0 && (
            <div style={{ marginTop: 24, padding: 20, background: '#f7fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#2b6cb0', marginBottom: 16, fontSize: '1.2rem' }}>Upload Results:</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {uploadResults.map((res, idx) => (
                  <li key={idx} style={{
                    background: res.status === 'success' ? '#e6fffa' : '#fff5f5',
                    color: res.status === 'success' ? '#2c7a7b' : '#c53030',
                    border: res.status === 'success' ? '1px solid #b2f5ea' : '1px solid #feb2b2',
                    borderRadius: 8,
                    padding: '12px 16px',
                    marginBottom: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    {res.status === 'success' ?
                      <span style={{ fontSize: '1.2em', lineHeight: 1 }}>✅</span> :
                      <span style={{ fontSize: '1.2em', lineHeight: 1 }}>❌</span>
                    }
                    <strong>{res.filename}</strong>: {res.status}
                    {res.status === 'error' && <span style={{ color: '#e53e3e', marginLeft: 'auto' }}> - {res.error}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Search Interface */}
        <section>
          <h2 style={{
            color: '#4a5568',
            fontWeight: 700,
            marginBottom: 24,
            fontSize: '1.8rem'
          }}>Search Documents</h2>
          <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Search by name, email, summary, skills, experience, education, projects..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '1px solid #a0aec0',
                borderRadius: 10,
                background: '#edf2f7',
                fontSize: '1rem',
                color: '#2d3748',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={e => e.target.style.borderColor = '#38a169'}
              onBlur={e => e.target.style.borderColor = '#a0aec0'}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                listStyle: 'none',
                padding: 0,
                margin: '4px 0 0 0',
                zIndex: 100
              }}>
                {suggestions.map((s, idx) => (
                  <li key={idx} style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid #edf2f7',
                    cursor: 'pointer',
                    color: '#4a5568',
                    transition: 'background-color 0.2s'
                  }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f4f8'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
            <button
              type="submit"
              disabled={searching}
              style={{
                background: searching ? '#a0aec0' : '#38a169',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '12px 32px',
                fontWeight: 700,
                cursor: searching ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s, transform 0.1s',
                fontSize: '1.1rem'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>
          {searchResults.length > 0 && (
            <div style={{ marginTop: 24, padding: 20, background: '#f7fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <h4 style={{ color: '#2b6cb0', marginBottom: 16, fontSize: '1.2rem' }}>Search Results:</h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 24
              }}>
                {searchResults.map(doc => (
                  <div key={doc.id} style={{
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: 20,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}>
                    <h3 style={{ color: '#2d3748', fontSize: '1.4rem', marginBottom: 4 }}>{doc.name}</h3>
                    <p style={{ color: '#4a5568', fontSize: '0.95rem' }}><strong>Email:</strong> {doc.email}</p>
                    <p style={{ color: '#4a5568', fontSize: '0.95rem' }}><strong>Phone:</strong> {doc.phone}</p>
                    <p style={{ color: '#4a5568', fontSize: '0.95rem' }}><strong>Location:</strong> {doc.location}</p>
                    {doc.skills && doc.skills.length > 0 && (
                      <p style={{ color: '#4a5568', fontSize: '0.95rem' }}><strong>Skills:</strong> {doc.skills.join(', ')}</p>
                    )}
                    {doc.summary && (
                      <p style={{ color: '#4a5568', fontSize: '0.95rem' }}><strong>Summary:</strong> {doc.summary.substring(0, 150)}...</p>
                    )}
                    <p style={{ color: '#718096', fontSize: '0.85rem', marginTop: 8 }}>Uploaded: {new Date(doc.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
