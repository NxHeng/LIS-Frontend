// RenameDialog.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import muiStyles, { TransitionZoom } from '../../../styles/muiStyles';

const RenameDialog = ({ renameDialogOpen, handleRenameDialogClose, handleRenameItem, selectedFile, newName, handleNameChange }) => {
    return (
        <Dialog
            open={renameDialogOpen}
            onClose={handleRenameDialogClose}
            PaperProps={{
                sx: {
                    ...muiStyles.DialogStyleSX,
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    height: 'auto',
                    width: '30vw',
                    p: 2
                }
            }}
        >
            <DialogTitle sx={muiStyles.DialogTitleStyle}>
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
            <DialogActions sx={{ px: 2 }}>
                <Button onClick={handleRenameDialogClose} variant='outlined' color="error" sx={muiStyles.detailsButtonStyle}>
                    Cancel
                </Button>
                <Button onClick={handleRenameItem} variant='contained' color="primary" sx={muiStyles.detailsButtonStyle}>
                    Rename
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RenameDialog;
