import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function DocumentDetailsModal({ selectedDocumentDetails, setSelectedDocumentDetails }) {
    if (!selectedDocumentDetails) {
        return null;
    }

    const handleClose = () => {
        setSelectedDocumentDetails(null);
    };

    return (
        <Dialog open={!!selectedDocumentDetails} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, borderBottom: '1px solid #eee' }}>
                <Typography variant="h3" component="h2">Document Details</Typography>
                <IconButton onClick={handleClose} aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ lineHeight: 1.8, color: '#4a5568', pt: 2 }}>
                {Object.entries(selectedDocumentDetails).filter(([key]) => !['created_at', 'updated_at', 'filename', 'raw_data'].includes(key)).map(([key, value]) => (
                    <Typography key={key} variant="body1" sx={{ mb: 1 }}>
                        <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</strong> {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
                    </Typography>
                ))}
            </DialogContent>
        </Dialog>
    );
}

export default DocumentDetailsModal; 