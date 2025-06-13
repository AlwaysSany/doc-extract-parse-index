import React, { useState } from 'react';
import { Box, Typography, Button, LinearProgress, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function UploadSection({ API_BASE, showNotification, onUploadSuccess }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFiles.length) {
            showNotification('Please select at least one file to upload.', 'info');
            return;
        }
        setIsUploading(true);
        setUploadProgress(0);

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

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                setIsUploading(false);
                if (xhr.status === 200) {
                    console.log('Upload successful:', xhr.responseText);
                    showNotification('File uploaded successfully!', 'success');
                    onUploadSuccess();
                } else {
                    const errorMessage = xhr.responseText || 'Unknown error';
                    console.error('Upload failed:', errorMessage);
                    showNotification(`Upload failed: ${errorMessage}`, 'error');
                }
                resetUploadState();
            }
        };

        xhr.open('POST', `${API_BASE}/api/upload`, true);
        xhr.send(formData);
    };

    const resetUploadState = () => {
        setSelectedFiles([]);
        setUploadProgress(0);
        setIsUploading(false);
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
                    disabled={isUploading}
                    startIcon={isUploading ? null : <CloudUploadIcon />}
                    sx={{
                        padding: '14px 28px',
                        backgroundColor: isUploading ? '#95a5a6' : '#2980b9',
                        '&:hover': {
                            backgroundColor: isUploading ? '#95a5a6' : '#3498db',
                        },
                    }}
                >
                    {isUploading ? 'Uploading...' : 'Upload Files'}
                </Button>
            </Box>

            {isUploading && (
                <Box sx={{ width: '100%', marginTop: 2 }}>
                    <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 10, borderRadius: 5 }} />
                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1, textAlign: 'center' }}>
                        Uploading... {uploadProgress}%
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default UploadSection; 