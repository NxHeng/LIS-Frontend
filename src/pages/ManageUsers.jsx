// ManageUsers.jsx
import React, { useState, useEffect, act } from 'react';
import { Button, Box, Typography, Stack, Container, Tabs, Tab, Card, Pagination } from '@mui/material';
import UserTable from '../components/ManageUsers/UserTable';
import DeleteDialog from '../components/DeleteDialog';
// import UserApprovalDialog from '../components/ManageUsers/UserApprovalDialog';
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
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    // const [selectedUserId, setSelectedUserId] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    // Pagination states
    const [pendingStaffPage, setPendingStaffPage] = useState(1);
    const [pendingClientPage, setPendingClientPage] = useState(1);
    const [activeStaffPage, setActiveStaffPage] = useState(1);
    const [activeClientPage, setActiveClientPage] = useState(1);
    const [rejectedStaffPage, setRejectedStaffPage] = useState(1);
    const [rejectedClientPage, setRejectedClientPage] = useState(1);

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

    // Handle pagination
    const handlePageChange = (event, newPage, type) => {
        switch (type) {
            // case 'pendingStaff':
            //     setPendingStaffPage(newPage);
            //     break;
            // case 'pendingClient':
            //     setPendingClientPage(newPage);
            //     break;
            case 'activeStaff':
                setActiveStaffPage(newPage);
                break;
            case 'activeClient':
                setActiveClientPage(newPage);
                break;
            // case 'rejectedStaff':
            //     setRejectedStaffPage(newPage);
            //     break;
            // case 'rejectedClient':
            //     setRejectedClientPage(newPage);
            //     break;
            default:
                break;
        }
    };

    const getPagedData = (data, page) => {
        const itemsPerPage = 5;
        const startIndex = (page - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    const openDeleteDialog = async () => {
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = async () => {
        setDeleteDialogOpen(false);
    };

    const handleDeleteUserClick = async (user) => {
        setSelectedUser(user);
        openDeleteDialog();
    };


    // const handleApproveStaff = async (userId) => {
    //     updateUserRole(userId, 'clerk');
    //     const tempUser = pendingStaffs.find(user => user._id === userId);
    //     tempUser.role = 'clerk';
    //     setActiveStaffs([...activeStaffs, tempUser]);
    //     setPendingStaffs(pendingStaffs.filter(user => user._id !== userId));
    // };

    // const handleApproveClient = async (userId) => {
    //     updateUserRole(userId, 'client');
    //     const tempUser = pendingClients.find(user => user._id === userId);
    //     tempUser.role = 'client';
    //     setActiveClients([...activeClients, tempUser]);
    //     setPendingClients(pendingClients.filter(user => user._id !== userId));
    // };

    const handleRoleChange = async (userId, newRole) => {
        updateUserRole(userId, newRole);
        setActiveStaffs(activeStaffs.map(user => {
            if (user._id === userId) {
                return { ...user, role: newRole };
            }
            return user;
        }));
    };

    // const handleRejectStaff = async (userId) => {
    //     updateUserRole(userId, 'rejected');
    //     const tempUser = pendingStaffs.find(user => user._id === userId);
    //     tempUser.role = 'rejected';
    //     setRejectedStaffs([...rejectedStaffs, tempUser]);
    //     setPendingStaffs(pendingStaffs.filter(user => user._id !== userId));
    // };

    // const handleRejectClient = async (userId) => {
    //     updateUserRole(userId, 'client-rejected');
    //     const tempUser = pendingClients.find(user => user._id === userId);
    //     tempUser.role = 'client-rejected';
    //     setRejectedClients([...rejectedClients, tempUser]);
    //     setPendingClients(pendingClients.filter(user => user._id !== userId));
    // };


    const handleDeleteActiveUser = async (userId) => {
        deleteUser(userId);
        setActiveStaffs(activeStaffs.filter(user => user._id !== userId));
        setActiveClients(activeClients.filter(user => user._id !== userId));
        closeDeleteDialog();
    };

    const handleDeleteRejectedUser = async (userId) => {
        deleteUser(userId);
        setRejectedStaffs(rejectedStaffs.filter(user => user._id !== userId));
        setRejectedClients(rejectedClients.filter(user => user._id !== userId));
        closeDeleteDialog();
    };

    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    // const handleCloseDialog = () => {
    //     setDialogOpen(false);
    //     setSelectedUser(null);
    // };

    // const handleTabChange = (event, newValue) => {
    //     setTabValue(newValue);
    // };

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
            <DeleteDialog
                deleteDialogOpen={deleteDialogOpen}
                closeDeleteDialog={closeDeleteDialog} // Close the dialog when canceled
                confirmDelete={selectedUser?.role === 'client-rejected' ? handleDeleteRejectedUser : handleDeleteActiveUser} // Confirm the deletion
                isUser={true}
                selectedUser={selectedUser}
            />

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
                            {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={tabValue} onChange={handleTabChange} aria-label="user management tabs">
                                    <Tab sx={{ textTransform: 'capitalize' }} label="Pending" {...a11yProps(0)} />
                                    <Tab sx={{ textTransform: 'capitalize' }} label="Active" {...a11yProps(1)} />
                                    <Tab sx={{ textTransform: 'capitalize' }} label="Rejected" {...a11yProps(2)} />
                                </Tabs>
                            </Box> */}

                            {/* Pending Users */}
                            {/* <CustomTabPanel value={tabValue} index={0}>
                                <Box>
                                    {renderRoleTitle('staffs')}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <UserTable
                                            users={getPagedData(pendingStaffs, pendingStaffPage)}
                                            handleApprove={handleApproveStaff}
                                            onEdit={handleOpenDialog}
                                            isStaff={true}
                                            isPending={true}
                                            handleReject={handleRejectStaff}
                                        />

                                        <Pagination
                                            count={Math.ceil(pendingStaffs.length / 5)}
                                            page={pendingStaffPage}
                                            onChange={(e, newPage) => handlePageChange(e, newPage, 'pendingStaff')}
                                            sx={{ mt: 2 }}
                                        />
                                    </Box>
                                    {renderRoleTitle('clients')}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <UserTable
                                            users={getPagedData(pendingClients, pendingClientPage)}
                                            handleApprove={handleApproveClient}
                                            onEdit={handleOpenDialog}
                                            isClient={true}
                                            isPending={true}
                                            handleReject={handleRejectClient}
                                        />
                                        <Pagination
                                            count={Math.ceil(pendingClients.length / 5)}
                                            page={pendingClientPage}
                                            onChange={(e, newPage) => handlePageChange(e, newPage, 'pendingClient')}
                                            sx={{ mt: 2 }}
                                        />
                                    </Box>
                                </Box>
                            </CustomTabPanel> */}

                            {/* Active Users */}
                            {/* <CustomTabPanel value={tabValue} index={1}> */}
                                <Box>
                                    {renderRoleTitle('staffs')}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <UserTable
                                            users={getPagedData(activeStaffs, activeStaffPage)}
                                            isStaff={true}
                                            handleRoleChange={handleRoleChange}
                                            onEdit={handleOpenDialog}
                                            handleDeleteUser={handleDeleteActiveUser}
                                            openDeleteDialog={openDeleteDialog}
                                            closeDeleteDialog={closeDeleteDialog}
                                            deleteDialogOpen={deleteDialogOpen}
                                            handleDeleteUserClick={handleDeleteUserClick}
                                        />
                                        <Pagination
                                            count={Math.ceil(activeStaffs.length / 5)}
                                            page={activeStaffPage}
                                            onChange={(e, newPage) => handlePageChange(e, newPage, 'activeStaff')}
                                            sx={{ mt: 2 }}
                                        />
                                    </Box>
                                    {renderRoleTitle('clients')}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <UserTable
                                            users={getPagedData(activeClients, activeClientPage)}
                                            isClient={true}
                                            handleRoleChange={handleRoleChange}
                                            onEdit={handleOpenDialog}
                                            handleDeleteUser={handleDeleteActiveUser}
                                            openDeleteDialog={openDeleteDialog}
                                            closeDeleteDialog={closeDeleteDialog}
                                            deleteDialogOpen={deleteDialogOpen}
                                            handleDeleteUserClick={handleDeleteUserClick}
                                        />
                                        <Pagination
                                            count={Math.ceil(activeClients.length / 5)}
                                            page={activeClientPage}
                                            onChange={(e, newPage) => handlePageChange(e, newPage, 'activeClient')}
                                            sx={{ mt: 2 }}
                                        />
                                    </Box>
                                </Box>
                            {/* </CustomTabPanel> */}

                            {/* <CustomTabPanel value={tabValue} index={2}>
                    <UserTable
                        users={activeUsers.filter(user => user.role === 'client')}
                        isClient={true}
                        onEdit={handleOpenDialog}
                    />
                </CustomTabPanel> */}

                            {/* Rejected Users */}
                            {/* <CustomTabPanel value={tabValue} index={2}>
                                <Box>
                                    {renderRoleTitle('staffs')}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <UserTable
                                            users={getPagedData(rejectedStaffs, rejectedStaffPage)}
                                            isRejected={true}
                                            isStaff={true}
                                            onEdit={handleOpenDialog}
                                            handleDeleteUser={handleDeleteRejectedUser}
                                            openDeleteDialog={openDeleteDialog}
                                            closeDeleteDialog={closeDeleteDialog}
                                            deleteDialogOpen={deleteDialogOpen}
                                            handleDeleteUserClick={handleDeleteUserClick}
                                        />
                                        <Pagination
                                            count={Math.ceil(rejectedStaffs.length / 5)}
                                            page={rejectedStaffPage}
                                            onChange={(e, newPage) => handlePageChange(e, newPage, 'rejectedStaff')}
                                            sx={{ mt: 2 }}
                                        />
                                    </Box>
                                    {renderRoleTitle('clients')}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <UserTable
                                            users={getPagedData(rejectedClients, rejectedClientPage)}
                                            isRejected={true}
                                            isClient={true}
                                            onEdit={handleOpenDialog}
                                            handleDeleteUser={handleDeleteRejectedUser}
                                            openDeleteDialog={openDeleteDialog}
                                            closeDeleteDialog={closeDeleteDialog}
                                            deleteDialogOpen={deleteDialogOpen}
                                            handleDeleteUserClick={handleDeleteUserClick}
                                        />
                                        <Pagination
                                            count={Math.ceil(rejectedClients.length / 5)}
                                            page={rejectedClientPage}
                                            onChange={(e, newPage) => handlePageChange(e, newPage, 'rejectedClient')}
                                            sx={{ mt: 2 }}
                                        />
                                    </Box>
                                </Box>
                            </CustomTabPanel> */}

                            {/* {selectedUser && (
                                <UserApprovalDialog
                                    open={dialogOpen}
                                    user={selectedUser}
                                    onClose={handleCloseDialog}
                                    onApprove={() => handleApprove(selectedUser.id)}
                                />
                            )} */}
                        </Box>
                    </Card>
                </Stack>
            </Container>
        </>
    );
};

// function CustomTabPanel(props) {
//     const { children, value, index, ...other } = props;

//     return (
//         <Box
//             role="tabpanel"
//             hidden={value !== index}
//             id={`simple-tabpanel-${index}`}
//             aria-labelledby={`simple-tab-${index}`}
//             {...other}
//         >
//             {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//         </Box>
//     );
// }

// function a11yProps(index) {
//     return {
//         id: `simple-tab-${index}`,
//         'aria-controls': `simple-tabpanel-${index}`,
//     };
// }

export default ManageUsers;
