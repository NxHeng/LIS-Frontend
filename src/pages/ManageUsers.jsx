// ManageUsers.jsx
import React, { useState, useEffect, act } from 'react';
import { Button, Box, Typography, Stack, Container, Tabs, Tab, Card } from '@mui/material';
import UserTable from '../components/ManageUsers/UserTable';
import UserApprovalDialog from '../components/ManageUsers/UserApprovalDialog';
import muiStyles from '../styles/muiStyles';
import Background from '../components/Background';
import { ManageAccounts, Person } from '@mui/icons-material';
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

    const renderRoleTitle = (role) => {
        if (role === 'staffs') {
            return (
                <Box sx={muiStyles.sideNavTitleStyle}>
                    <ManageAccounts fontSize="medium" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                        Staffs
                    </Typography>
                </Box>
            );
        }
        return (
            <Box sx={muiStyles.sideNavTitleStyle}>
                <Person fontSize="medium" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                    Clients
                </Typography>
            </Box>
        );
    };

    return (
        <>
            <Background />
            <Container sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <Card sx={{ ...muiStyles.cardStyle, p: 2 }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            px: 2,
                            pt: 1,
                            pb: .5,
                        }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                Manage Users
                            </Typography>
                        </Box>
                    </Card>


                    <Card sx={{ ...muiStyles.cardStyle, p: 4 }}>

                        <Box>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user management tabs">
                                    <Tab sx={{ textTransform: 'capitalize' }} label="Pending" {...a11yProps(0)} />
                                    <Tab sx={{ textTransform: 'capitalize' }} label="Active" {...a11yProps(1)} />
                                    <Tab sx={{ textTransform: 'capitalize' }} label="Rejected" {...a11yProps(2)} />
                                </Tabs>
                            </Box>

                            {/* Pending Users */}
                            <CustomTabPanel value={tabValue} index={0}>
                                <Stack direction='column' spacing={5}>
                                    <Box>
                                        {renderRoleTitle('staffs')}
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
                                        {renderRoleTitle('clients')}
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
                                        {renderRoleTitle('staffs')}
                                        <UserTable
                                            users={activeStaffs}
                                            isStaff={true}
                                            handleRoleChange={handleRoleChange}
                                            onEdit={handleOpenDialog}
                                            handleDeleteUser={handleDeleteActiveUser}
                                        />
                                    </Box>
                                    <Box>
                                        {renderRoleTitle('clients')}
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
                                        {renderRoleTitle('staffs')}
                                        <UserTable
                                            users={rejectedStaffs}
                                            isRejected={true}
                                            isStaff={true}
                                            onEdit={handleOpenDialog}
                                            handleDeleteUser={handleDeleteRejectedUser}
                                        />
                                    </Box>
                                    <Box>
                                        {renderRoleTitle('clients')}
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
                    </Card>
                </Stack>
            </Container>
        </>
    );
};

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </Box>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default ManageUsers;
