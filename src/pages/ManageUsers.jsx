// ManageUsers.jsx
import React, { useState, useEffect, act } from 'react';
import { Button, Box, Typography, Stack, Container, Tabs, Tab } from '@mui/material';
import UserTable from '../components/ManageUsers/UserTable';
import UserApprovalDialog from '../components/ManageUsers/UserApprovalDialog';
import { useUserContext } from '../context/UserContext';

const ManageUsers = () => {
    const [pendingStaffs, setPendingStaffs] = useState([]);
    const [pendingClients, setPendingClients] = useState([]);
    const [activeStaffs, setActiveStaffs] = useState([]);
    const [activeClients, setActiveClients] = useState([]);
    const [rejectedStaffs, setRejectedStaffs] = useState([]);
    const [rejectedClients, setRejectedClients] = useState([]);

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
            setPendingStaffs(userList.filter(user => user.role === 'pending'));
            setActiveStaffs(userList.filter(
                user => user.role === 'clerk' || user.role === 'solicitor' || user.role === 'admin'
            ));
            setRejectedStaffs(userList.filter(user => user.role === 'rejected'));

            setPendingClients(userList.filter(user => user.role === 'client-pending'));
            setActiveClients(userList.filter(user => user.role === 'client'));
            setRejectedClients(userList.filter(user => user.role === 'client-rejected'));
        }
    }, [userList]);

    const handleApproveStaff = async (userId) => {
        updateUserRole(userId, 'clerk');
        const tempUser = pendingStaffs.find(user => user._id === userId);
        tempUser.role = 'clerk';
        setActiveStaffs([...activeStaffs, tempUser]);
        setPendingStaffs(pendingStaffs.filter(user => user._id !== userId));
    };

    const handleApproveClient = async (userId) => {
        updateUserRole(userId, 'client');
        const tempUser = pendingClients.find(user => user._id === userId);
        tempUser.role = 'client';
        setActiveClients([...activeClients, tempUser]);
        setPendingClients(pendingClients.filter(user => user._id !== userId));
    };

    const handleRoleChange = async (userId, newRole) => {
        updateUserRole(userId, newRole);
        setActiveStaffs(activeStaffs.map(user => {
            if (user._id === userId) {
                return { ...user, role: newRole };
            }
            return user;
        }));
    };

    const handleRejectStaff = async (userId) => {
        updateUserRole(userId, 'rejected');
        const tempUser = pendingStaffs.find(user => user._id === userId);
        tempUser.role = 'rejected';
        setRejectedStaffs([...rejectedStaffs, tempUser]);
        setPendingStaffs(pendingStaffs.filter(user => user._id !== userId));
    };

    const handleRejectClient = async (userId) => {
        updateUserRole(userId, 'client-rejected');
        const tempUser = pendingClients.find(user => user._id === userId);
        tempUser.role = 'client-rejected';
        setRejectedClients([...rejectedClients, tempUser]);
        setPendingClients(pendingClients.filter(user => user._id !== userId));
    };


    const handleDeleteActiveUser = async (userId) => {
        deleteUser(userId);
        setActiveStaffs(activeStaffs.filter(user => user._id !== userId));
        setActiveClients(activeClients.filter(user => user._id !== userId));
    };

    const handleDeleteRejectedUser = async (userId) => {
        deleteUser(userId);
        setRejectedStaffs(rejectedStaffs.filter(user => user._id !== userId));
        setRejectedClients(rejectedClients.filter(user => user._id !== userId));
    };

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
                        <Tab label="Active" {...a11yProps(1)} />
                        <Tab label="Rejected" {...a11yProps(2)} />
                    </Tabs>
                </Box>

                {/* Pending Users */}
                <CustomTabPanel value={tabValue} index={0}>
                    <Stack direction='column' spacing={5}>
                        <Box>
                            <Typography variant='h4'>
                                Staffs
                            </Typography>
                            <UserTable
                                users={pendingStaffs}
                                handleApprove={handleApproveStaff}
                                onEdit={handleOpenDialog}
                                isStaff={true}
                                isPending={true}
                                handleReject={handleRejectStaff}
                            />
                        </Box>
                        <Box>
                            <Typography variant='h4'>
                                Clients
                            </Typography>
                            <UserTable
                                users={pendingClients}
                                handleApprove={handleApproveClient}
                                onEdit={handleOpenDialog}
                                isClient={true}
                                isPending={true}
                                handleReject={handleRejectClient}
                            />
                        </Box>
                    </Stack>
                </CustomTabPanel>

                {/* Active Users */}
                <CustomTabPanel value={tabValue} index={1}>
                    <Stack direction='column' spacing={5}>
                        <Box>
                            <Typography variant='h4'>
                                Staffs
                            </Typography>
                            <UserTable
                                users={activeStaffs}
                                isStaff={true}
                                handleRoleChange={handleRoleChange}
                                onEdit={handleOpenDialog}
                                handleDeleteUser={handleDeleteActiveUser}
                            />
                        </Box>
                        <Box>
                            <Typography variant='h4'>
                                Clients
                            </Typography>
                            <UserTable
                                users={activeClients}
                                isClient={true}
                                handleRoleChange={handleRoleChange}
                                onEdit={handleOpenDialog}
                                handleDeleteUser={handleDeleteActiveUser}
                            />
                        </Box>
                    </Stack>
                </CustomTabPanel>

                {/* <CustomTabPanel value={tabValue} index={2}>
                    <UserTable
                        users={activeUsers.filter(user => user.role === 'client')}
                        isClient={true}
                        onEdit={handleOpenDialog}
                    />
                </CustomTabPanel> */}

                {/* Rejected Users */}
                <CustomTabPanel value={tabValue} index={2}>
                    <Stack direction='column' spacing={5}>
                        <Box>
                            <Typography variant='h4'>
                                Staffs
                            </Typography>
                            <UserTable
                                users={rejectedStaffs}
                                isRejected={true}
                                isStaff={true}
                                onEdit={handleOpenDialog}
                                handleDeleteUser={handleDeleteRejectedUser}
                            />
                        </Box>
                        <Box>
                            <Typography variant='h4'>
                                Clients
                            </Typography>
                            <UserTable
                                users={rejectedClients}
                                isRejected={true}
                                isClient={true}
                                onEdit={handleOpenDialog}
                                handleDeleteUser={handleDeleteRejectedUser}
                            />
                        </Box>
                    </Stack>
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
