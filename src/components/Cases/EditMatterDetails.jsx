import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Stack, Card, CardContent } from '@mui/material';
import muiStyles from '../../styles/muiStyles';

import { useCategoryContext } from '../../context/CategoryContext';
import { useCaseContext } from '../../context/CaseContext';
import { useUserContext } from '../../context/UserContext';

const EditMatterDetails = ({ caseItem }) => {
    const { updateCaseInDatabase, fetchCase, toMatterDetails } = useCaseContext();
    const { getUserList, userList } = useUserContext();
    const { fetchCategory, category } = useCategoryContext();
    // const caseItem = JSON.parse(localStorage.getItem('caseItem'));
    const [editedData, setEditedData] = useState(caseItem);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     if (caseItem.category) {
    //         fetchCategory(caseItem.category);
    //     }
    // }, [caseItem.category, fetchCategory]);

    useEffect(() => {
        const fetchData = async () => {
            await getUserList();
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleSave = () => {
        updateCaseInDatabase(caseItem._id, editedData);
        // update these specific fields in local storage
        localStorage.setItem('caseItem', JSON.stringify(editedData));
        toMatterDetails();
    };

    const handleChange = (e, index, field) => {
        const { name, value } = e.target;

        if (name === 'clients' || name === 'icNumber') {
            // Update client details
            setEditedData(currentData => ({
                ...currentData,
                clients: currentData.clients.map((client, i) =>
                    i === index ? { ...client, [field]: value } : client
                )
            }));
        } else if (name === 'solicitorInCharge') {
            setEditedData({
                ...editedData,
                solicitorInCharge: { _id: value }
            });
        } else if (name === 'clerkInCharge') {
            setEditedData({
                ...editedData,
                clerkInCharge: { _id: value }
            });
        } else {
            setEditedData({ ...editedData, [name]: value });
        }
    };


    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <Card sx={{ ...muiStyles.cardStyle, p: 2, mb: 2, display: "flex", justifyContent: "space-between" }}>
                <Box sx={{
                    px: 2,
                    pt: .5,
                    pb: .5,
                }}>
                    <Typography variant="h6">
                        Edit Matter Details
                    </Typography>

                </Box>
                <Box>
                    <Button onClick={toMatterDetails} variant="text" sx={{ ...muiStyles.detailsButtonStyle }}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="contained" sx={muiStyles.detailsButtonStyle}>
                        Save Changes
                    </Button>
                </Box>
            </Card>
            <Card sx={{ ...muiStyles.cardStyle, p: 4 }}>
                <Box component="form">
                    <TextField
                        fullWidth
                        label="Matter Name"
                        name="matterName"
                        value={editedData.matterName}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="File Reference"
                        name="fileReference"
                        value={editedData.fileReference}
                        onChange={handleChange}
                        variant="outlined"
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                        <InputLabel id="solicitor-label">Solicitor In Charge</InputLabel>
                        <Select
                            labelId="solicitor-label"
                            id="solicitor-select"
                            value={editedData.solicitorInCharge._id || ''}
                            label="Solicitor In Charge"
                            name="solicitorInCharge"
                            onChange={handleChange}
                        >
                            {/* {userList.filter(user => user.role == 'solicitor').map(user => ( */}
                            {userList.filter(user => user.role === 'clerk' || user.role === 'solicitor' || user.role === 'admin').map(user => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                        <InputLabel id="clerk-label">Clerk In Charge</InputLabel>
                        <Select
                            labelId="clerk-label"
                            id="clerk-select"
                            value={editedData.clerkInCharge._id || ''}
                            label="Clerk In Charge"
                            name="clerkInCharge"
                            onChange={handleChange}
                        >
                            {/* {userList.filter(user => user.role === 'clerk').map(user => ( */}
                            {userList.filter(user => user.role === 'clerk' || user.role === 'solicitor' || user.role === 'admin').map(user => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {editedData.clients.map((client, index) => (
                        <Stack direction="row" spacing={2} sx={{ mb: 3 }} key={index}>
                            <TextField
                                fullWidth
                                label={`Client ${index + 1}`}
                                name="clients"
                                value={client.name}
                                onChange={(e) => handleChange(e, index, 'name')}
                                variant="outlined"
                                margin="normal"
                            />
                            <TextField
                                fullWidth
                                label={`Client IC ${index + 1}`}
                                name="icNumber"
                                value={client.icNumber}
                                onChange={(e) => handleChange(e, index, 'icNumber')}
                                variant="outlined"
                                margin="normal"
                            />
                        </Stack>
                    ))}
                </Box >
            </Card>
        </Container>
    );
};

export default EditMatterDetails;
