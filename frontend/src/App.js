import React, { useState, useEffect } from 'react';
import './App.css';
import UploadSection from './components/UploadSection';
import SearchSection from './components/SearchSection';
import DocumentListSection from './components/DocumentListSection';
import DocumentDetailsModal from './components/DocumentDetailsModal';
import Notification from './components/Notification';
import { createTheme, ThemeProvider, Box, Typography, Paper } from '@mui/material'; // Import MUI components

// Define a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2980b9', // Blue
    },
    secondary: {
      main: '#2ecc71', // Green for success
    },
    error: {
      main: '#e74c3c', // Red for error
    },
    info: {
      main: '#3498db', // Light blue for info
    },
    background: {
      default: 'linear-gradient(135deg, #e0f2f7 0%, #c3cfe2 100%)',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.8rem',
      color: '#2c3e50',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      color: '#34495e',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.8rem',
      color: '#2c3e50',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.4rem',
      color: '#34495e',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          transition: 'background 0.3s ease, transform 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(1px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: '#ecf0f1',
            '& fieldset': {
              borderColor: '#bdc3c7',
            },
            '&:hover fieldset': {
              borderColor: '#3498db',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3498db',
              boxShadow: '0 0 0 3px rgba(52, 152, 219, 0.3)',
            },
          },
        },
      },
    },
  },
});

function App() {
  // State for document listing
  const [allDocuments, setAllDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [errorLoadingDocuments, setErrorLoadingDocuments] = useState(null);
  const [selectedDocumentDetails, setSelectedDocumentDetails] = useState(null);
  const [notification, setNotification] = useState(null); // { message: '...', type: 'success/error/info' }

  // Helper to get backend URL (adjust if needed)
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

  // Function to fetch all documents
  const fetchAllDocuments = async () => {
    console.log('Fetching all documents...');
    setLoadingDocuments(true);
    setErrorLoadingDocuments(null);
    try {
      const res = await fetch(`${API_BASE}/api/documents`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Fetched documents:', data.results);
      setAllDocuments(data.results || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setErrorLoadingDocuments(err.message);
      showNotification(`Failed to load documents: ${err.message}`, 'error');
    } finally {
      setLoadingDocuments(false);
    }
  };

  // Fetch all documents on component mount
  useEffect(() => {
    fetchAllDocuments();
  }, []); // Empty dependency array means this runs once on mount

  // Show notification message
  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/document/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Fetched document details:', data); // Debugging line
      setSelectedDocumentDetails(data);
      console.log('selectedDocumentDetails after set:', data); // Debugging line
    } catch (err) {
      console.error('Error fetching document details:', err);
      showNotification(`Failed to load document details: ${err.message}`, 'error');
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/document/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      showNotification(data.message || 'Document deleted successfully!', 'success');
      // Re-fetch documents after deletion
      fetchAllDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      showNotification(`Failed to delete document: ${err.message}`, 'error');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        fontFamily: theme.typography.fontFamily,
        padding: '0',
        boxSizing: 'border-box'
      }}>
        <Paper elevation={3} sx={{
          width: '100%', // Use 100% width, controlled by maxWidth
          maxWidth: 1200, // Set a max-width for the content
          margin: '0 auto',
          background: theme.palette.background.paper,
          borderRadius: 16,
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          paddingTop: theme.spacing(4),
          paddingBottom: theme.spacing(5),
          paddingX: theme.spacing(4), // Add more horizontal padding
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing(4), // Introduce consistent gap between sections
          overflowX: 'auto' // Enable horizontal scrolling if content overflows
        }}>
          <Typography variant="h1" component="div" sx={{
            textAlign: 'left',
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(4), // Increase space below header
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center'
          }}>
            <img src={`${process.env.PUBLIC_URL}/document_extractor_log.png`} alt="Document Extractor Logo" style={{ marginRight: '15px', height: '3rem' }} />
            Document Extractor
          </Typography>

          {/* Notification Display */}
          <Notification notification={notification} setNotification={setNotification} />

          {/* Upload Interface */}
          <UploadSection API_BASE={API_BASE} showNotification={showNotification} onUploadSuccess={fetchAllDocuments} />

          {/* Search Interface */}
          <SearchSection
            API_BASE={API_BASE}
            showNotification={showNotification}
            handleViewDetails={handleViewDetails}
            handleDeleteDocument={handleDeleteDocument}
          />

          {/* New section for Document Listing */}
          <DocumentListSection
            API_BASE={API_BASE}
            showNotification={showNotification}
            allDocuments={allDocuments}
            loadingDocuments={loadingDocuments}
            errorLoadingDocuments={errorLoadingDocuments}
            handleViewDetails={handleViewDetails}
            handleDeleteDocument={handleDeleteDocument}
          />

          {/* Document Details Modal */}
          <DocumentDetailsModal
            selectedDocumentDetails={selectedDocumentDetails}
            setSelectedDocumentDetails={setSelectedDocumentDetails}
          />
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App;
