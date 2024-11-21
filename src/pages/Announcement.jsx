import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Stack, Button, Autocomplete, InputAdornment, TextField, Pagination, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AnnouncementCard from '../components/Announcement/AnnouncementCard.jsx';
import { useAnnouncementContext } from '../context/AnnouncementContext.jsx';
import { jwtDecode } from "jwt-decode";


const Announcement = () => {

    const { announcements, selectedAnnouncement, setSelectedAnnouncement, createAnnouncement, fetchAnnouncements, setAnnouncementsLoaded, updateAnnouncement, deleteAnnouncement } = useAnnouncementContext();
    // const user = JSON.parse(localStorage.getItem('user'));
    const [panel, setPanel] = useState('detail');
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        description: ''
    });
    const [editForm, setEditForm] = useState({ title: '', description: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    const user = jwtDecode(localStorage.getItem('token'));


    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAnnouncement({ ...newAnnouncement, [name]: value });
    };

    const handleInputChangeEdit = (e) => {
        const { name, value } = e.target;
        setEditForm({ ...editForm, [name]: value });
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const announcementsPerPage = 7; // Define how many announcements per page

    // Calculate total pages
    const totalPages = Math.ceil(announcements.length / announcementsPerPage);

    // Get announcements for the current page
    const startIndex = (currentPage - 1) * announcementsPerPage;
    const sortedAnnouncements = announcements.sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentAnnouncements = sortedAnnouncements.slice(startIndex, startIndex + announcementsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleCardClick = (announcement) => {
        console.log('Card clicked:', announcement);
        setSelectedAnnouncement(announcement);
        setPanel('detail'); // Switch to detail view
    };


    // Handle form submission
    const handleCreate = async () => {
        if (newAnnouncement.title && newAnnouncement.description) {
            await createAnnouncement(newAnnouncement);
            // Optionally, reset the form after successful submission
            setNewAnnouncement({ title: '', description: '' });
            // Optionally switch back to the detail panel or close the form
        } else {
            console.log('Please fill in all fields');
        }
    };

    // Handle save button click
    const handleSave = async () => {
        const updatedAnnouncement = {
            ...selectedAnnouncement,
            ...editForm,
        };
        await updateAnnouncement(updatedAnnouncement);
        setPanel('detail'); // Switch back to the detail panel after saving
    };


    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this announcement?');
        if (!confirmDelete) return;

        setIsDeleting(true);

        try {
            await deleteAnnouncement(selectedAnnouncement);
            setPanel(null);
        } catch (error) {
            console.error('Error during deletion:', error);
        } finally {
            setIsDeleting(false);
        }
    }

    const formatDateTime = (dateTime) => {
        const date = dateTime.substring(0, 10);
        const time = dateTime.substring(11, 19);

        const [year, month, day] = date.split('-');
        const reversedDate = `${day}-${month}-${year}`;

        return `${time} ${reversedDate}`;
    }

    //fetch announcements from database
    useEffect(() => {
        const fetchAnnouncementsFromDatabase = async () => {
            try {
                // Show loading spinner?***
                setAnnouncementsLoaded(true);
                // Fetch announcements from the database
                await fetchAnnouncements();
                // Hide loading spinner
                setAnnouncementsLoaded(false);
            } catch (error) {
                console.log('Error fetching announcements:', error);
            }
        };
        fetchAnnouncementsFromDatabase();
    }, []);

    useEffect(() => {
        if (selectedAnnouncement) {
            setEditForm({
                title: selectedAnnouncement.title,
                description: selectedAnnouncement.description,
            });
        }
    }, [selectedAnnouncement]);

    return (
        <>
            <Grid container>
                {/* Announcement List */}
                <Grid item xs={7} sx={{ height: '90vh', overflowY: 'auto', px: 2, mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 3 }}>
                        <Typography variant="h3">Announcements</Typography>
                        {user?.role === 'admin' && (
                            <Button
                                variant="contained"
                                sx={{ borderRadius: 2 }}
                                onClick={() => setPanel('add')} // Switch to add panel
                            >
                                Add Announcement
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 3 }}>
                        <Typography sx={{ pl: '13vh' }} variant='h5'>Title</Typography>
                        <Typography sx={{ pr: '23vh' }} variant='h6'>Time</Typography>
                    </Box>

                    <Container>
                        {currentAnnouncements.map((announcement, index) => (
                            <AnnouncementCard
                                key={index}
                                announcement={announcement}
                                onClick={() => handleCardClick(announcement)} // Handle click event
                            />
                        ))}

                        {/* Pagination Component */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </Container>
                </Grid>

                {/* Announcement Detail */}
                {panel === 'detail' && selectedAnnouncement && (
                    <Grid item xs={5} sx={{ height: '90vh', bgcolor: "#f8f9fa", p: 4 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="h5">Announcement Detail</Typography>
                            {user?.role === 'admin' && (
                                <Box sx={{ display: "flex", justifyContent: "normal" }}>
                                    <Button
                                        variant="contained"
                                        sx={{ px: 5, borderRadius: 2, mr: 2 }}
                                        onClick={() => setPanel('edit')} // Switch to edit panel
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ px: 5, borderRadius: 2 }}
                                        onClick={handleDelete}
                                        color='error'
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            )}
                        </Box>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant='h6' color='grey'>Date</Typography>
                                <Typography>{formatDateTime(selectedAnnouncement.date)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant='h6' color='grey'>Title</Typography>
                                <Typography>{selectedAnnouncement.title}</Typography>
                            </Box>
                            <Box>
                                <Typography variant='h6' color='grey'>Description</Typography>
                                <Typography>{selectedAnnouncement.description}</Typography>
                            </Box>
                        </Stack>
                    </Grid>
                )}

                {/* Announcement Edit */}
                {panel === 'edit' && selectedAnnouncement && (
                    <Grid item xs={5} sx={{ height: '90vh', bgcolor: "#f8f9fa", p: 4 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="h5">Edit Announcement</Typography>
                            <Button
                                variant="contained"
                                sx={{ px: 5, borderRadius: 2 }}
                                onClick={handleSave} // Call the handleSave function on submit
                            >
                                Save
                            </Button>
                        </Box>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant='h6' color='grey'>Date</Typography>
                                <Typography>{formatDateTime(selectedAnnouncement.date)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant='h6' color='grey'>Title</Typography>
                                <TextField
                                    fullWidth
                                    name="title"
                                    value={editForm.title}
                                    onChange={handleInputChangeEdit}
                                />
                            </Box>
                            <Box>
                                <Typography variant='h6' color='grey'>Description</Typography>
                                <TextField
                                    fullWidth
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleInputChangeEdit}
                                    multiline
                                    rows={4}
                                />
                            </Box>
                        </Stack>
                    </Grid>
                )}

                {/* Add Announcement */}
                {panel === 'add' && (
                    <Grid item xs={5} sx={{ height: '90vh', bgcolor: "#f8f9fa", p: 4 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="h5">Add Announcement</Typography>
                            <Button
                                variant="contained"
                                sx={{ px: 5, borderRadius: 2 }}
                                onClick={handleCreate} // Call the handleCreate function on submit
                            >
                                Create
                            </Button>
                        </Box>
                        <Stack spacing={2}>
                            <Box>
                                <Typography variant='h6' color='grey'>Title</Typography>
                                <TextField
                                    fullWidth
                                    name="title"
                                    placeholder="Enter title"
                                    value={newAnnouncement.title}
                                    onChange={handleInputChange}
                                />
                            </Box>
                            <Box>
                                <Typography variant='h6' color='grey'>Description</Typography>
                                <TextField
                                    fullWidth
                                    name="description"
                                    placeholder="Enter description"
                                    multiline
                                    rows={4}
                                    value={newAnnouncement.description}
                                    onChange={handleInputChange}
                                />
                            </Box>
                        </Stack>
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default Announcement;