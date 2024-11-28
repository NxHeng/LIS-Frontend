import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Card } from '@mui/material';
import muiStyles, { TransitionZoom } from '../../../styles/muiStyles';

const LogDialog = ({ open, onClose, onAddLog }) => {
    const [logMessage, setLogMessage] = useState('');

    const handleAddLog = () => {
        if (logMessage.trim()) {
            onAddLog(logMessage); // Send log message to parent component
            setLogMessage(''); // Reset the input field
            onClose(); // Close the dialog
        } else {
            alert('Please enter a log message.'); // Validation for empty input
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={TransitionZoom}
            PaperProps={{
                sx: {
                    ...muiStyles.DialogStyleSX,  // Apply the existing styles from DialogStyle
                    backgroundColor: 'rgba(255, 255, 255, 1)',  // Overwrite the background color
                }
            }}
        >
            <DialogTitle sx={muiStyles.DialogTitleStyle}>
                Add a Log
            </DialogTitle>
            <DialogContent >
                <TextField
                    autoFocus
                    margin="dense"
                    label="Log Message"
                    type="text"
                    fullWidth
                    value={logMessage}
                    onChange={(e) => setLogMessage(e.target.value)}
                    multiline
                    rows={5}
                />
            </DialogContent>
            <DialogActions sx={{ px: 2 }}>
                <Button onClick={onClose} variant='outlined' color="error" sx={muiStyles.detailsButtonStyle}>
                    Cancel
                </Button>
                <Button onClick={handleAddLog} variant="contained" color="primary" sx={muiStyles.detailsButtonStyle}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LogDialog;
