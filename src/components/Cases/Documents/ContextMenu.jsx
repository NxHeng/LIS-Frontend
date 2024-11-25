// ContextMenu.js
import React from 'react';
import { Menu, MenuItem, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const ContextMenu = ({ anchorPosition, handleAnchorClose, handleMove, handleDelete, handleRename, handleDownload, selectedFile, caseId }) => {

    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : {};

    // Build menu items conditionally
    const menuItems = [];

    if (user.role !== 'client') {
        menuItems.push(<MenuItem key="move" onClick={handleMove}>Move</MenuItem>);
        menuItems.push(<MenuItem key="rename" onClick={handleRename}>Rename</MenuItem>);
    }
    if (user.role === 'admin' || user.role === 'solicitor') {
        menuItems.push(<MenuItem key="delete" onClick={() => handleDelete(caseId)}>Delete</MenuItem>);
    }
    if (selectedFile) {
        menuItems.push(<MenuItem key="download" onClick={handleDownload}>Download</MenuItem>);
    }

    return (
        <Menu
            open={Boolean(anchorPosition)}
            onClose={handleAnchorClose}
            anchorReference="anchorPosition"
            anchorPosition={
                anchorPosition !== null
                    ? { top: anchorPosition.mouseY, left: anchorPosition.mouseX }
                    : undefined
            }
        >
            <Typography variant="h6" sx={{ px: 2, my: 1 }} color='textSecondary'>
                Actions
            </Typography>
            {/* {user.role !== 'client' && <MenuItem onClick={handleMove}>Move</MenuItem>}
            {user.role === 'admin' || user.role === 'solicitor' &&
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            }
            {user.role !== 'client' && <MenuItem onClick={handleRename}>Rename</MenuItem>}
            {selectedFile ? <MenuItem onClick={handleDownload}>Download</MenuItem> : null} */}

            {menuItems.length > 0 ? (
                menuItems
            ) : (
                <MenuItem disabled>No actions available</MenuItem>
            )}
        </Menu>
    );
};

export default ContextMenu;
