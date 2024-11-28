import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import muiStyles from '../styles/muiStyles';

import { useDocumentContext } from '../context/DocumentContext';

const DeleteDialog = ({ deleteDialogOpen, closeDeleteDialog, confirmDelete, isAnnouncement, isTask, isLog, caseId, logId, isCategory, category }) => {

    const { selectedFile, selectedFolder } = useDocumentContext();

    return (
        <Dialog
            open={deleteDialogOpen}
            onClose={closeDeleteDialog}
            aria-labelledby="delete-confirmation-dialog"
            PaperProps={{
                sx: {
                    ...muiStyles.DialogStyleSX,  // Apply the existing styles from DialogStyle
                    backgroundColor: 'rgba(255, 255, 255, 1)',  // Overwrite the background color
                }
            }}
        >
            <DialogTitle sx={muiStyles.DialogTitleStyle} id="delete-confirmation-dialog">Confirm Deletion</DialogTitle>
            <DialogContent>
                {
                    isAnnouncement ? (
                        <DialogContentText>
                            Are you sure you want to delete this announcement? This action cannot be undone.
                        </DialogContentText>
                    ) : isTask ? (
                        <DialogContentText>
                            Are you sure you want to delete this task? This action cannot be undone.
                        </DialogContentText>
                    ) : isLog ? (
                        <DialogContentText>
                            Are you sure you want to delete this log? This action cannot be undone.
                        </DialogContentText>
                    ) : isCategory ? (
                        <DialogContentText>
                            Deleting this category will affect the cases associated with it. Are you sure you want to delete this category? This action cannot be undone.
                        </DialogContentText>
                    ) : (
                        <DialogContentText>
                            Are you sure you want to delete "{selectedFile?.fileName || selectedFolder?.folderName}"? This action cannot be undone.
                        </DialogContentText>
                    )
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDeleteDialog} variant='outlined' sx={muiStyles.detailsButtonStyle} color="error">
                    Cancel
                </Button>
                <Button onClick={() => isLog ? confirmDelete(caseId, logId) : isCategory? confirmDelete(category) : confirmDelete()} variant='contained' sx={muiStyles.detailsButtonStyle} color="primary" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteDialog;
