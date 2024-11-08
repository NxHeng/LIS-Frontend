// UserApprovalDialog.jsx
import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

const UserApprovalDialog = ({ open, onClose, user, onApprove }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Approve New User</DialogTitle>
            <DialogContent>
                <Typography>Name: {user.name}</Typography>
                <Typography>Email: {user.email}</Typography>
                <Typography>Requested Role: {user.role}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={onApprove} color="primary" variant="contained">
                    Approve
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserApprovalDialog;
