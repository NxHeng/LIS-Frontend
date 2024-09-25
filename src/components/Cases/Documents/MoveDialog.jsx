import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';

import { useDocumentContext } from '../../../context/DocumentContext';

const MoveDialog = ({ caseId, moveDialogOpen, handleMoveDialogClose, selectedFolderForMove, setSelectedFolderForMove, handleMoveFile, selectedFile, selectedFolder, folderStackForMove, setFolderStackForMove }) => {

    const { folderDataForMove, fetchFolders } = useDocumentContext();
    const [filteredFolders, setFilteredFolders] = useState([]);

    useEffect(() => {
        console.log(selectedFolder?._id);
        setFilteredFolders(folderDataForMove?.folders.filter(folder =>
            folder._id !== selectedFolder?._id && folder._id !== selectedFile?.folderId
        ));
    }, [folderDataForMove, selectedFolder, selectedFile]);

    const handleFolderClick = (folder) => {
        setSelectedFolderForMove(folder);
        setFolderStackForMove([...folderStackForMove, folder._id]); // Add current folder to stack
    };

    useEffect(() => {
        // console.log(folderStackForMove);
        // setFolderStackForMove([]);
        fetchFolders(caseId);
    }, []);

    useEffect(() => {
        console.log(folderStackForMove.length);
        fetchFolders(caseId);
    }, [selectedFolderForMove]);

    useEffect(() => {
        console.log(folderDataForMove);
        console.log(filteredFolders);
    }, [folderDataForMove]);

    const handleBackClick = () => {
        const newStack = [...folderStackForMove];
        const previousFolderId = newStack.pop() || null; // Remove the last folder from stack
        const previousFolder = folderDataForMove.folders.find(folder => folder._id === previousFolderId);
        setFolderStackForMove(newStack); // Update the stack
        setSelectedFolderForMove(previousFolder);
    };

    return (
        <Dialog open={moveDialogOpen} onClose={handleMoveDialogClose}>
            <DialogTitle>Select a Folder</DialogTitle>
            <DialogContent>
                <List>
                    {filteredFolders.length > 0 ? (
                        filteredFolders.map((folder) => (
                            <ListItem
                                key={folder._id}
                                onClick={() => handleFolderClick(folder)}
                                sx={{
                                    backgroundColor: selectedFolderForMove && selectedFolderForMove._id === folder._id ? 'rgba(0, 0, 0, 0.08)' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                        cursor: 'pointer',
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    <FolderIcon fontSize="medium" />
                                </ListItemIcon>
                                <ListItemText primary={folder.folderName} />
                            </ListItem>
                        ))
                    ) : (
                        //center the text
                        <Typography variant="body1" align="left">
                            No folders available.
                        </Typography>
                    )}
                </List>
                {folderStackForMove?.length > 0 && (
                    <Button onClick={handleBackClick} sx={{ mb: 2 }}>
                        Back to Previous Folder
                    </Button>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleMoveDialogClose} color="primary">Cancel</Button>
                <Button onClick={handleMoveFile} color="primary">Move</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MoveDialog;
