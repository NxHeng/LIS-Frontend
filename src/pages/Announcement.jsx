import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Stack, Button, Card, CardContent, TextField, Pagination, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Attachment } from '@mui/icons-material';
import AnnouncementCard from '../components/Announcement/AnnouncementCard.jsx';
import DeleteDialog from '../components/DeleteDialog.jsx';
import { useAnnouncementContext } from '../context/AnnouncementContext.jsx';
import { jwtDecode } from "jwt-decode";
import muiStyles from '../styles/muiStyles.jsx';
import Background from '../components/Background.jsx';
import AttachmentUpload from '../components/Announcement/AttachmentUpload.jsx';
import { Link } from 'react-router-dom';

const Announcement = () => {

    const { announcements, selectedAnnouncement, setSelectedAnnouncement, createAnnouncement, fetchAnnouncements, setAnnouncementsLoaded, updateAnnouncement, deleteAnnouncement, fetchAttachment, deleteAttachment, currentAttachment, setCurrentAttachment } = useAnnouncementContext();
    // const user = JSON.parse(localStorage.getItem('user'));
    const [panel, setPanel] = useState(null);
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        description: ''
    });
    const [editForm, setEditForm] = useState({ title: '', description: '' });
    const [attachment, setAttachment] = useState(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [openDialog, setOpenDialog] = useState(false); // Controls dialog visibility

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

    const handleAttachmentChange = (file) => {
        setAttachment(file);
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
            const formData = new FormData();
            formData.append('title', newAnnouncement.title);
            formData.append('description', newAnnouncement.description);
            if (attachment) {
                formData.append('attachment', attachment);
            }

            await createAnnouncement(formData);
            // Reset the form after successful submission
            setNewAnnouncement({ title: '', description: '' });
            setAttachment(null);
            setPanel(null);
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
        // If a new file is selected, append it to the form data
        const formData = new FormData();
        // Add updated title and description
        formData.append('title', updatedAnnouncement.title);
        formData.append('description', updatedAnnouncement.description);

        // If a new file is added, append it
        console.log('Attachment:', attachment);
        if (attachment) {
            formData.append('attachment', attachment);
        } else if (selectedAnnouncement.fileURI && !attachment) {
            formData.append('attachment', null);
        }
        try {
            await updateAnnouncement(formData, updatedAnnouncement._id);
            setPanel('detail');
        } catch (error) {
            console.error('Error updating announcement:', error);
        }
    };

    const handleRemoveFile = async () => {
        setAttachment(null);
        setCurrentAttachment(null);
        console.log('Attachment removed:', selectedAnnouncement.fileURI);
        await deleteAttachment(selectedAnnouncement.fileURI);
        setSelectedAnnouncement({ ...selectedAnnouncement, fileURI: null, fileName: null });
    };

    // Trigger the dialog to open
    const handleDeleteClick = () => {
        setOpenDialog(true);
    };

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            await deleteAnnouncement(selectedAnnouncement);
            setPanel(null);
        } catch (error) {
            console.error('Error during deletion:', error);
        } finally {
            setIsDeleting(false);
            setOpenDialog(false);
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
            // Set the edit form data
            setEditForm({
                title: selectedAnnouncement.title,
                description: selectedAnnouncement.description,
            });

            // Check if the announcement has an attachment before fetching
            if (selectedAnnouncement.fileURI) {
                const loadAttachment = async () => {
                    const result = await fetchAttachment(selectedAnnouncement.fileURI);
                    setCurrentAttachment(result);
                };
                loadAttachment();
            } else {
                setCurrentAttachment(null); // No attachment, clear the previous attachment
            }
        }
    }, [selectedAnnouncement]); // Trigger when selectedAnnouncement changes

    return (
        <>
            <DeleteDialog
                deleteDialogOpen={openDialog}
                closeDeleteDialog={() => setOpenDialog(false)} // Close the dialog when canceled
                confirmDelete={handleDelete} // Confirm the deletion
                isAnnouncement={true}
            />

            <Background />
            <Grid container >
                {/* Announcement List */}
                <Grid item xs={7} sx={{ p: 4 }}>
                    <Stack direction="column" spacing={2}>

                        <Card sx={muiStyles.cardStyle}>
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Announcements</Typography>
                                {user?.role === 'admin' && (
                                    <Button
                                        variant="contained"
                                        sx={muiStyles.buttonStyle}
                                        onClick={() => setPanel('add')} // Switch to add panel
                                    >
                                        Add Announcement
                                    </Button>
                                )}
                            </CardContent>
                        </Card>



                        <Card sx={muiStyles.cardStyle}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 3 }}>
                                    <Typography sx={{ pl: '11vh' }} variant='h6'>Title</Typography>
                                    <Typography sx={{ pr: '19vh' }} variant='h6'>Date</Typography>
                                </Box>


                                {currentAnnouncements.map((announcement, index) => (
                                    <AnnouncementCard
                                        key={index}
                                        announcement={announcement}
                                        onClick={() => handleCardClick(announcement)} // Handle click event
                                    />
                                ))}
                            </CardContent>
                        </Card>
                        <Card sx={muiStyles.cardStyle}>
                            <CardContent>
                                {/* Pagination Component */}
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Pagination
                                        count={totalPages}
                                        page={currentPage}
                                        onChange={handlePageChange}
                                        color="primary"
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                {/* Announcement Detail */}
                {panel === 'detail' && selectedAnnouncement && (
                    <Grid item xs={5} sx={{ p: 4 }}>
                        <Card sx={{ ...muiStyles.cardStyle, p: 4 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Typography variant="h5">Announcement Detail</Typography>
                                {user?.role === 'admin' && (
                                    <Box sx={{ display: "flex", justifyContent: "normal" }}>
                                        <Button
                                            variant="contained"
                                            sx={{ ...muiStyles.detailsButtonStyle, px: 4, mr: 2 }}
                                            onClick={() => setPanel('edit')} // Switch to edit panel
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ ...muiStyles.detailsButtonStyle, px: 4 }}
                                            onClick={handleDeleteClick}
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
                                {selectedAnnouncement.fileURI && (
                                    <>
                                        <Box>
                                            <Typography variant='h6' color='grey'>Attachment</Typography>
                                            <Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                                                    <Attachment sx={{ mr: 1 }} />
                                                    <a href={currentAttachment} target="_blank" rel="noreferrer">
                                                        {selectedAnnouncement.fileName}
                                                    </a>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </Stack>
                        </Card>
                    </Grid>
                )}

                {/* Announcement Edit */}
                {panel === 'edit' && selectedAnnouncement && (
                    <Grid item xs={5} sx={{ p: 4 }}>
                        <Card sx={{ ...muiStyles.cardStyle, p: 4 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Typography variant="h5">Edit Announcement</Typography>
                                <Button
                                    variant="contained"
                                    sx={{ ...muiStyles.detailsButtonStyle, px: 4, mr: 2 }}
                                    onClick={handleSave}
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
                                        rows={12}
                                    />
                                </Box>

                                {/* {selectedAnnouncement.fileURI && (
                                    <>
                                        <Box>
                                            <Typography variant='h6' color='grey'>Attachment</Typography>
                                            <Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                                                    <Attachment sx={{ mr: 1 }} />
                                                    <a href={currentAttachment} target="_blank" rel="noreferrer">
                                                        {selectedAnnouncement.fileName}
                                                    </a>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </>
                                )} */}

                                <Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                                        <AttachmentUpload
                                            existingFile={selectedAnnouncement} // Pass existing file for display
                                            onAttachmentChange={handleAttachmentChange} // Handle file selection
                                            onRemoveFile={handleRemoveFile} // Handle file removal
                                        />
                                    </Box>
                                </Box>

                            </Stack>
                        </Card>
                    </Grid>
                )}

                {/* Add Announcement */}
                {panel === 'add' && (
                    <Grid item xs={5} sx={{ p: 4 }}>
                        <Card sx={{ ...muiStyles.cardStyle, p: 4 }}>
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
                                        rows={12}
                                        value={newAnnouncement.description}
                                        onChange={handleInputChange}
                                    />
                                </Box>
                                <AttachmentUpload
                                    onAttachmentChange={(file) => handleAttachmentChange(file)}
                                />

                            </Stack>
                        </Card>
                    </Grid>
                )}

                {panel === null && (
                    <Grid item xs={5} sx={{ p: 4 }}>
                        <Card sx={{ ...muiStyles.cardStyle, height: 'auto' }}>
                            <CardContent>
                                <Stack direction='column' sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "auto", p: 2 }}>
                                    <Typography variant='h5'>Announcement Detail</Typography>
                                    <Typography>No announcement selected</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </>
    );
};

export default Announcement;