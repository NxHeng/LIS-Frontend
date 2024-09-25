// RenameDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const RenameDialog = ({ renameDialogOpen, handleRenameDialogClose, handleRenameItem, selectedFile, newName, handleNameChange }) => {
    return (
        <Dialog open={renameDialogOpen} onClose={handleRenameDialogClose}>
            <DialogTitle>
                Rename {selectedFile?.fileName ? "File" : "Folder"}
            </DialogTitle>
            <DialogContent>
                <TextField
                    variant='outlined'
                    autoFocus
                    margin="dense"
                    label={selectedFile?.fileName ? "File Name" : "Folder Name"}
                    type="text"
                    fullWidth
                    value={newName}
                    onChange={handleNameChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleRenameDialogClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleRenameItem} color="primary">
                    Rename
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RenameDialog;
