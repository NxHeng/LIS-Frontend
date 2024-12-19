// FilePreviewDialog.js
import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import muiStyles, { TransitionZoom } from '../../../styles/muiStyles';

const FilePreviewDialog = ({ open, selectedFile, filePreview, handleFileClose }) => {

    return (
        <Dialog
            maxWidth='lg'
            open={open}
            onClose={handleFileClose}
            TransitionComponent={TransitionZoom}
            PaperProps={{
                sx: {
                    ...muiStyles.DialogStyleSX,
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    height: 'auto',
                    width: '100vw',
                    p: 1
                }
            }}
        >
            <DialogTitle sx={muiStyles.DialogTitleStyle}>
                {selectedFile?.fileName}
                <IconButton
                    aria-label="close"
                    onClick={handleFileClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 1 }}>
                    {selectedFile?.fileType === 'application/pdf' && filePreview && (
                        <iframe
                            src={filePreview}
                            width="100%"
                            height={window.innerHeight * 0.8}
                            title="PDF Preview"
                        />
                    )}
                    {['image/jpeg', 'image/png'].includes(selectedFile?.fileType) && filePreview && (
                        <img
                            src={filePreview}
                            alt={selectedFile.fileName}
                            style={{ maxWidth: '90vh', maxHeight: '80vh', objectFit: 'contain' }}
                        />
                    )}
                    {selectedFile?.fileType === 'text/plain' && filePreview && (
                        <pre style={{ whiteSpace: 'pre-wrap' }}>{filePreview}</pre>
                    )}
                    {selectedFile?.fileType === 'text/csv' && filePreview && (
                        <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', paddingLeft:750 }}>{filePreview}
                        </pre>
                    )}
                    {['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ].includes(selectedFile?.fileType) && filePreview && (
                        <iframe
                            src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(filePreview)}`}
                            width="100%"
                            height="600px"
                            title="Word Document Preview"
                        />
                    )}


                    {/* Fallback for unsupported file types */}
                    {!filePreview && (
                        <Typography variant="body2">
                            Unable to preview this file type. Please download the file to view it.
                        </Typography>
                    )}
                    
                    {/* Add conditions for other file types here */}


                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default FilePreviewDialog;
