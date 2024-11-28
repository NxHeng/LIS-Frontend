import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import muiStyles, { TransitionZoom } from '../../../styles/muiStyles';

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
        <Dialog
            open={moveDialogOpen}
            onClose={handleMoveDialogClose}
            TransitionComponent={TransitionZoom}
            PaperProps={{
                sx: {
                    ...muiStyles.DialogStyleSX,
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    height: 'auto',
                    width: '30vw',
                    p: 4
                }
            }}
        >
            <DialogTitle sx={muiStyles.DialogTitleStyle}>Select a Folder</DialogTitle>
            <DialogContent sx={{ borderRadius: 3, border: 1, pb: 0.5 }}>
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
                        <Typography variant="body1" align="left" sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                            No folders available.
                        </Typography>
                    )}
                </List>
                {/* {folderStackForMove?.length > 0 && (
                    <Button onClick={handleBackClick} sx={{ ...muiStyles.detailsButtonStyle, my: 2 }}>
                        Back to Previous Folder
                    </Button>
                )} */}
            </DialogContent>
            <DialogActions sx={{ px: 0, py: 1, mt: 2 }}>
                {folderStackForMove?.length > 0 && (
                    <Button onClick={handleBackClick} variant='text' sx={{ ...muiStyles.detailsButtonStyle, my: 2 }}>
                        Back to Previous Folder
                    </Button>
                )}
                <Button onClick={handleMoveDialogClose} variant='outlined' color="error" sx={muiStyles.detailsButtonStyle}>Cancel</Button>
                <Button onClick={handleMoveFile} variant='contained' color="primary" sx={{ ...muiStyles.detailsButtonStyle, m: 0 }}>Move</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MoveDialog;
