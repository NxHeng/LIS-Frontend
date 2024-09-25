import React, { useEffect } from 'react';
import { ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';

import { useDocumentContext } from '../../../context/DocumentContext';

const FolderItem = ({ folder, setCurrentFolderId }) => {

    const { fetchContents, currentFolderId, setFolderStack, folderStack, setSelectedFolder, setSelectedFile } = useDocumentContext();
    const caseItem = localStorage.getItem('caseItem');
    const caseId = JSON.parse(caseItem)._id;

    const handleFolderDoubleClick = () => {
        setSelectedFile(null);
        setFolderStack([...folderStack, currentFolderId]);
        setCurrentFolderId(folder._id);
    };

    const handleFolderClick = () => {
        setSelectedFile(null);
        console.log(folder);
        setSelectedFolder(folder);
    };

    useEffect(() => {
        fetchContents(caseId);
        console.log(currentFolderId);
    }, [currentFolderId]);

    return (
        <ListItem
            onClick={handleFolderClick}
            onDoubleClick={handleFolderDoubleClick}
            sx={{
                '&:hover': {
                    backgroundColor: '#f0f0f0', // Hover effect (light grey)
                    cursor: 'pointer',
                },
            }}
        >
            <ListItemIcon>
                <FolderIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary={folder.folderName} />
        </ListItem>
    );
};

export default FolderItem;
