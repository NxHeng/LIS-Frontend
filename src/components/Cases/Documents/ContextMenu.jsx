// ContextMenu.js
import React from 'react';
import { Menu, MenuItem, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const ContextMenu = ({ anchorPosition, handleAnchorClose, handleMove, handleDelete, handleRename, handleDownload, selectedFile }) => {

    const user = jwtDecode(localStorage.getItem('token'));

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
            {user.role !== 'client' && <MenuItem onClick={handleMove}>Move</MenuItem>}
            {user.role === 'admin' || user.role === 'solicitor' &&
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            }
            {user.role !== 'client' && <MenuItem onClick={handleRename}>Rename</MenuItem>}
            {selectedFile ? <MenuItem onClick={handleDownload}>Download</MenuItem> : null}
        </Menu>
    );
};

export default ContextMenu;
