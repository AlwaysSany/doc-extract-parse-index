import React, { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

function SearchSection({ API_BASE, showNotification, handleViewDetails, handleDeleteDocument }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Debounce function
    const debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    };

    // Fetch suggestions from backend (now using search API)
    const fetchSuggestions = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(query)}`); // Use search API
            const data = await res.json();
            setSuggestions(data.results.map(doc => `${doc.filename} - ${doc.excerpt ? doc.excerpt.substring(0, 50) + '...' : 'No excerpt'}`) || []);
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
        console.log('handleSearch called');
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
        <Box sx={{ marginBottom: 6, position: 'relative' }}>
            <Typography variant="h2" component="h2" sx={{ marginBottom: 3.5 }}>
                Search Documents
            </Typography>
            <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search query..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    sx={{ flex: 1 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={searching}
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                    sx={{
                        padding: '14px 20px',
                        backgroundColor: searching ? '#95a5a6' : '#2980b9',
                        '&:hover': {
                            backgroundColor: searching ? '#95a5a6' : '#3498db',
                        },
                    }}
                >
                    {searching ? 'Searching...' : 'Search'}
                </Button>
            </Box>

            {showSuggestions && suggestions.length > 0 && (
                <Paper sx={{
                    position: 'absolute',
                    top: 'calc(100% - 8px)',
                    left: 0,
                    right: 0,
                    borderRadius: '0 0 12px 12px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    zIndex: 500,
                    maxHeight: 200,
                    overflowY: 'auto',
                    py: 1
                }}>
                    <List sx={{ padding: 0 }}>
                        {suggestions.map((s, i) => (
                            <ListItem
                                key={i}
                                onClick={() => handleSuggestionClick(s)}
                                sx={{
                                    padding: '10px 18px',
                                    cursor: 'pointer',
                                    color: '#34495e',
                                    borderBottom: '1px solid #eee',
                                    '&:hover': { background: '#f2f2f2' }
                                }}
                            >
                                {s}
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}

            {searchResults.length > 0 && (
                <Box sx={{ marginTop: 2.5, borderTop: '1px solid #eee', paddingTop: 2.5 }}>
                    <Typography variant="h4" component="h3" sx={{ marginBottom: 2 }}>Search Results:</Typography>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: 3,
                        }}
                    >
                        {searchResults.map((result) => (
                            <Paper
                                key={result.id}
                                elevation={1}
                                sx={{
                                    padding: '20px',
                                    borderRadius: 2.5,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s ease-in-out',
                                    cursor: 'pointer',
                                    '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.1)' },
                                }}
                                onClick={() => handleViewDetails(result.id)}
                            >
                                <Typography variant="h4" component="h4" sx={{ color: '#2980b9', marginBottom: 1 }}>
                                    {result.name || result.filename}
                                </Typography>
                                {result.email && <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6, margin: '5px 0' }}><strong>Email:</strong> {result.email}</Typography>}
                                {result.location && <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6, margin: '5px 0' }}><strong>Location:</strong> {result.location}</Typography>}
                                {result.phone && <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6, margin: '5px 0' }}><strong>Phone:</strong> {result.phone}</Typography>}
                                <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                                    {result.excerpt}...
                                </Typography>
                                <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        startIcon={<VisibilityIcon />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewDetails(result.id);
                                        }}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        startIcon={<DeleteIcon />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteDocument(result.id);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default SearchSection; 