import React, { useState } from 'react';
import { Box, Typography, Button, LinearProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function UploadSection({ API_BASE, showNotification, onUploadSuccess }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadResults, setUploadResults] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFiles.length) {
            showNotification('Please select at least one file to upload.', 'info');
            return;
        }
        setUploading(true);
        setUploadProgress(0);
        setUploadResults([]);

        const formData = new FormData();
        for (let file of selectedFiles) {
            formData.append('files', file);
        }

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percentCompleted = Math.round((event.loaded * 100) / event.total);
                setUploadProgress(percentCompleted);
            }
        });

        xhr.addEventListener('load', () => {
            setUploading(false);
            setUploadProgress(0); // Reset progress bar
            const contentType = xhr.getResponseHeader('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = JSON.parse(xhr.responseText);
                setUploadResults(data.results || []);
                const successCount = data.results.filter(r => r.status === 'success').length;
                if (successCount > 0) {
                    showNotification(`${successCount} document(s) uploaded successfully!`, 'success');
                    if (onUploadSuccess) {
                        onUploadSuccess();
                    }
                }
                const errorCount = data.results.filter(r => r.status === 'error').length;
                if (errorCount > 0) {
                    showNotification(`${errorCount} document(s) failed to upload.`, 'error');
                }
            } else {
                setUploadResults([{ status: 'error', error: 'Server error: ' + xhr.responseText.slice(0, 100) }]);
                showNotification('Server error during upload. Please check console.', 'error');
            }
        });

        xhr.addEventListener('error', () => {
            setUploading(false);
            setUploadProgress(0);
            setUploadResults([{ status: 'error', error: 'Network error during upload.' }]);
            showNotification(`Network error during upload.`, 'error');
        });

        xhr.open('POST', `${API_BASE}/api/upload`);
        xhr.send(formData);
    };

    return (
        <Box sx={{ marginBottom: 0 }}>
            <Typography variant="h2" component="h2" sx={{ marginBottom: 0 }}>
                Upload Documents
            </Typography>
            <Box component="form" onSubmit={handleUpload} sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 1 }}>
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                        flex: 1,
                        padding: '14px 18px',
                        borderColor: '#bdc3c7',
                        color: '#34495e',
                        borderRadius: 3,
                        background: '#ecf0f1',
                        '&:hover': {
                            borderColor: '#3498db',
                            background: '#e0e0e0',
                        },
                    }}
                >
                    {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Choose Files'}
                    <input type="file" multiple accept=".pdf,.doc,.docx" onChange={handleFileChange} hidden />
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={uploading}
                    startIcon={uploading ? null : <CloudUploadIcon />}
                    sx={{
                        padding: '14px 28px',
                        backgroundColor: uploading ? '#95a5a6' : '#2980b9',
                        '&:hover': {
                            backgroundColor: uploading ? '#95a5a6' : '#3498db',
                        },
                    }}
                >
                    {uploading ? 'Uploading...' : 'Upload Files'}
                </Button>
            </Box>

            {uploading && uploadProgress > 0 && (
                <Box sx={{ width: '100%', mt: 2 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 10, borderRadius: 5 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                        {uploadProgress}%
                    </Typography>
                </Box>
            )}

            {uploadResults.length > 0 && (
                <Box sx={{ marginTop: 2.5, borderTop: '1px solid #eee', paddingTop: 2.5 }}>
                    <Typography variant="h4" component="h3" sx={{ marginBottom: 2 }}>Upload Results:</Typography>
                    <List sx={{ padding: 0 }}>
                        {uploadResults.map((result, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    background: result.status === 'success' ? '#e6ffe6' : '#ffe6e6',
                                    border: `1px solid ${result.status === 'success' ? '#27ae60' : '#c0392b'}`,
                                    padding: '10px 15px',
                                    marginBottom: 1.25,
                                    borderRadius: 2,
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 'unset', marginRight: 1 }}>
                                    {result.status === 'success' ? (
                                        <CheckCircleOutlineIcon sx={{ color: '#27ae60' }} />
                                    ) : (
                                        <ErrorOutlineIcon sx={{ color: '#c0392b' }} />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={result.filename || 'N/A'}
                                    secondary={result.error ? `(${result.error})` : null}
                                    primaryTypographyProps={{ fontWeight: 600, color: '#34495e' }}
                                    secondaryTypographyProps={{ color: '#c0392b' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
}

export default UploadSection; 