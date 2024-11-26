import React, { useEffect } from 'react';
import { ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { useDocumentContext } from '../../../context/DocumentContext';

const FileItem = ({ file }) => {
    //   const handleFileClick = () => {
    //     // Handle file download/view here
    //     window.alert(`You clicked on file: ${file.fileName}`);
    //   };

    const { open, setOpen, selectedFile, setSelectedFile, fetchPreview, setFilePreview, setSelectedFolder } = useDocumentContext();

    const handleFileDoubleClick = (file) => {
        setSelectedFolder(null);
        setSelectedFile(file);
        setOpen(true);
    };

    const handleFileClick = () => {
        setSelectedFolder(null);
        setSelectedFile(file);
    }

    useEffect(() => {
        console.log("fhiuwaehnfiuawhef: ", selectedFile);
    }, [selectedFile]);

    useEffect(() => {
        const fetchFilePreview = async () => {
            if (open && selectedFile) {
                const fileUrl = await fetchPreview(selectedFile._id);
                setFilePreview(fileUrl);
            }
        };
        fetchFilePreview();
    }, [open, selectedFile]);


    return (
        <ListItem
            onClick={() => handleFileClick(file)}
            onDoubleClick={() => handleFileDoubleClick(file)}
        >
            <ListItemIcon>
                <InsertDriveFileIcon fontSize="medium" />
            </ListItemIcon>
            {/* if filename too long, replace back with ... */}
            <ListItemText primary={file.fileName.length > 30 ? file.fileName.slice(0, 25) + '...' : file.fileName} />
            {/* <ListItemText primary={file.fileName} /> */}
        </ListItem>
    );
};

export default FileItem;
