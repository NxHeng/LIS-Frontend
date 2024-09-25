// ContextMenu.js
import React from 'react';
import { Menu, MenuItem, Typography } from '@mui/material';

const ContextMenu = ({ anchorPosition, handleAnchorClose, handleMove, handleDelete, handleRename, handleDownload, selectedFile }) => {
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
            <MenuItem onClick={handleMove}>Move</MenuItem> 
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
            <MenuItem onClick={handleRename}>Rename</MenuItem>
            {selectedFile ? <MenuItem onClick={handleDownload}>Download</MenuItem> : null}
        </Menu>
    );
};

export default ContextMenu;
