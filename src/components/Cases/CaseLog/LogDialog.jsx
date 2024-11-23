import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';

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
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add a Log</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Log Message"
                    type="text"
                    fullWidth
                    value={logMessage}
                    onChange={(e) => setLogMessage(e.target.value)}
                    multiline
                    rows={3} 
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    Cancel
                </Button>
                <Button onClick={handleAddLog} variant="contained" color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LogDialog;
