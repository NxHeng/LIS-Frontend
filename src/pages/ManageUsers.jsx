// ManageUsers.jsx
import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Divider, Container, Tabs, Tab } from '@mui/material';
import UserTable from '../components/ManageUsers/UserTable';
import UserApprovalDialog from '../components/ManageUsers/UserApprovalDialog';
import { useUserContext } from '../context/UserContext';

const ManageUsers = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [rejectedUsers, setRejectedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    const { userList, getUserList, updateUserRole, deleteUser } = useUserContext();

    useEffect(() => {
        // Fetch users (pending and active) on component mount
        getUserList();
    }, []);

    useEffect(() => {
        // Filter users into pending and active
        if (userList.length) {
            setPendingUsers(userList.filter(user => user.role === 'pending'));
            setActiveUsers(userList.filter(user => user.role !== 'pending' && user.role !== 'rejected'));
            setRejectedUsers(userList.filter(user => user.role === 'rejected'));
        }
    }, [userList]);

    const handleApprove = async (userId) => {
        updateUserRole(userId, 'clerk');
        const tempUser = pendingUsers.find(user => user._id === userId);
        tempUser.role = 'clerk';
        setActiveUsers([...activeUsers, tempUser]);
        setPendingUsers(pendingUsers.filter(user => user._id !== userId));
    };

    const handleRoleChange = async (userId, newRole) => {
        updateUserRole(userId, newRole);
        setActiveUsers(activeUsers.map(user => {
            if (user._id === userId) {
                return { ...user, role: newRole };
            }
            return user;
        }));
    };

    const handleReject = async (userId) => {
        updateUserRole(userId, 'rejected');
        const tempUser = pendingUsers.find(user => user._id === userId);
        tempUser.role = 'rejected';
        setRejectedUsers([...rejectedUsers, tempUser]);
        setPendingUsers(pendingUsers.filter(user => user._id !== userId));
    };

    const handleDeleteActiveUser = async (userId) => {
        deleteUser(userId);
        setActiveUsers(activeUsers.filter(user => user._id !== userId));
    };

    const handleDeleteRejectedUser = async (userId) => {
        deleteUser(userId);
        setRejectedUsers(rejectedUsers.filter(user => user._id !== userId));
    };

    useEffect(() => {
        console.log('Active Users:', activeUsers);
    }, [activeUsers]);

    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedUser(null);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };


    return (
        <Container sx={{ p: 2 }}>
            <Typography variant='h3'>Manage Users</Typography>
            <Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="user management tabs">
                        <Tab label="Pending" {...a11yProps(0)} />
                        <Tab label="Staffs" {...a11yProps(1)} />
                        <Tab label="Clients" {...a11yProps(2)} />
                        <Tab label="Rejected" {...a11yProps(3)} />
                    </Tabs>
                </Box>

                <CustomTabPanel value={tabValue} index={0}>
                    <UserTable
                        users={pendingUsers}
                        handleApprove={handleApprove}
                        onEdit={handleOpenDialog}
                        isPending={true}
                        handleReject={handleReject}
                    />
                </CustomTabPanel>

                <CustomTabPanel value={tabValue} index={1}>
                    <UserTable
                        users={activeUsers}
                        isStaff={true}
                        handleRoleChange={handleRoleChange}
                        onEdit={handleOpenDialog}
                        handleDeleteUser={handleDeleteActiveUser}
                    />
                </CustomTabPanel>

                <CustomTabPanel value={tabValue} index={2}>
                    <UserTable
                        users={activeUsers.filter(user => user.role === 'client')}
                        isClient={true}
                        onEdit={handleOpenDialog}
                    />
                </CustomTabPanel>

                <CustomTabPanel value={tabValue} index={3}>
                    <UserTable
                        users={rejectedUsers}
                        isRejected={true}
                        onEdit={handleOpenDialog}
                        handleDeleteUser={handleDeleteRejectedUser}
                    />
                </CustomTabPanel>

                {selectedUser && (
                    <UserApprovalDialog
                        open={dialogOpen}
                        user={selectedUser}
                        onClose={handleCloseDialog}
                        onApprove={() => handleApprove(selectedUser.id)}
                    />
                )}
            </Box>
        </Container>
    );
};

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default ManageUsers;
