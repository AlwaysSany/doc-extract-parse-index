import React from 'react';
import { Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

function DocumentListSection({ API_BASE, showNotification, allDocuments, loadingDocuments, errorLoadingDocuments, handleViewDetails, handleDeleteDocument }) {
    return (
        <Box sx={{ marginBottom: 6, position: 'relative' }}>
            <Typography variant="h2" component="h2" sx={{ marginBottom: 3.5 }}>
                Existing Documents
            </Typography>

            {loadingDocuments && <Typography sx={{ color: '#7f8c8d' }}>Loading documents...</Typography>}
            {errorLoadingDocuments && <Typography sx={{ color: '#e74c3c' }}>Error: {errorLoadingDocuments}</Typography>}

            {!loadingDocuments && !errorLoadingDocuments && allDocuments.length === 0 && (
                <Typography sx={{ color: '#7f8c8d' }}>No documents found.</Typography>
            )}

            {!loadingDocuments && !errorLoadingDocuments && allDocuments.length > 0 && (
                <TableContainer component={Box} sx={{ background: '#fff', borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
                    <Table aria-label="document list table">
                        <TableHead>
                            <TableRow sx={{ background: '#ecf0f1', borderBottom: '1px solid #ddd' }}>
                                <TableCell sx={{ padding: '15px 20px', textAlign: 'left', color: '#34495e', fontSize: '1.05rem' }}>Name</TableCell>
                                <TableCell sx={{ padding: '15px 20px', textAlign: 'left', color: '#34495e', fontSize: '1.05rem' }}>Email</TableCell>
                                <TableCell sx={{ padding: '15px 20px', textAlign: 'left', color: '#34495e', fontSize: '1.05rem' }}>Location</TableCell>
                                <TableCell sx={{ padding: '15px 20px', textAlign: 'left', color: '#34495e', fontSize: '1.05rem' }}>Phone</TableCell>
                                <TableCell sx={{ padding: '15px 20px', textAlign: 'center', color: '#34495e', fontSize: '1.05rem' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allDocuments.map(doc => (
                                <TableRow key={doc.id} sx={{ borderBottom: '1px solid #eee' }}>
                                    <TableCell sx={{ padding: '12px 20px', color: '#555', fontSize: '0.95rem' }}>{doc.name || 'N/A'}</TableCell>
                                    <TableCell sx={{ padding: '12px 20px', color: '#555', fontSize: '0.95rem' }}>{doc.email || 'N/A'}</TableCell>
                                    <TableCell sx={{ padding: '12px 20px', color: '#555', fontSize: '0.95rem' }}>{doc.location || 'N/A'}</TableCell>
                                    <TableCell sx={{ padding: '12px 20px', color: '#555', fontSize: '0.95rem' }}>{doc.phone || 'N/A'}</TableCell>
                                    <TableCell sx={{ padding: '12px 20px', textAlign: 'center' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => handleViewDetails(doc.id)}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteDocument(doc.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}

export default DocumentListSection; 