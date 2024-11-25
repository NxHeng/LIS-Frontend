import React, { useState } from 'react';
import { Button, Menu, MenuItem, Dialog, DialogActions, DialogTitle, DialogContent, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import muiStyles from '../../../styles/muiStyles';

const NewItem = ({ caseId, createFolder, uploadFile }) => {
    const [anchorEl, setAnchorEl] = useState(null); // Controls the menu
    const openMenu = Boolean(anchorEl); // Open state for the menu
    const [folderDialogOpen, setFolderDialogOpen] = useState(false); // Controls the dialog open state
    const [folderName, setFolderName] = useState(''); // Stores the folder name input
    const [selectedFile, setSelectedFile] = useState(null); // Store the file selected for upload


    // Opens the menu when clicking "New" button
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // Closes the menu
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Opens the create folder dialog and closes the menu
    const handleCreateFolderClick = () => {
        console.log('Opening create folder dialog');
        setFolderDialogOpen(true); // Set folderDialogOpen to true to show the dialog
        handleClose(); // Close the menu after clicking "Create Folder"
    };

    // Closes the create folder dialog
    const handleDialogClose = () => {
        console.log('Closing create folder dialog');
        setFolderDialogOpen(false); // Set folderDialogOpen to false to close the dialog
        setFolderName(''); // Clear the folder name input
    };

    // Handles folder name input change
    const handleFolderNameChange = (event) => {
        setFolderName(event.target.value);
    };

    // Handles the folder creation
    const handleCreateFolder = () => {
        if (folderName.trim()) {
            console.log("Create Folder clicked with name:", folderName);
            // Add your create folder logic or API call here
            createFolder({ caseId, folderName }); // Example of passing data to backend
            setFolderDialogOpen(false); // Close the dialog after creating folder
        } else {
            console.log("Folder name is required.");
        }
    };

    // Upload file logic (placeholder)
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            handleUploadFile(file);
        }
    };

    // Handles file upload
    const handleUploadFile = (file) => {
        if (file) {
            console.log("Uploading file:", file.name);
            // Add your upload file logic here (e.g., API call)
            uploadFile({ caseId, file }); // Assuming uploadFile is a function passed via props
            handleClose(); // Close the menu after uploading the file
        }
    };

    return (
        <>
            {/* New button that opens the menu */}
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleClick}
                sx={{ ...muiStyles.detailsButtonStyle, width: '20vh' }}
            >
                New
            </Button>

            {/* Menu with Create Folder and Upload File options */}
            <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <MenuItem onClick={handleCreateFolderClick}>
                    <CreateNewFolderIcon sx={{ mr: 3 }} />
                    Create Folder
                </MenuItem>
                <MenuItem onClick={() => document.getElementById('file-upload').click()}>
                    <UploadFileIcon sx={{ mr: 3 }} />
                    Upload File
                </MenuItem>
            </Menu>

            {/* Dialog for creating a new folder */}
            <Dialog
                open={folderDialogOpen} // Dialog visibility depends on folderDialogOpen state
                onClose={handleDialogClose}
            >
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogContent>
                    <TextField
                        variant='outlined'
                        autoFocus
                        margin="dense"
                        label="Folder Name"
                        type="text"
                        fullWidth
                        value={folderName}
                        onChange={handleFolderNameChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateFolder} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Hidden file input */}
            <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
        </>
    );
};

export default NewItem;
