import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

import { useCategoryContext } from '../../context/CategoryContext';
import { useCaseContext } from '../../context/CaseContext';
import { useUserContext } from '../../context/UserContext';

const EditMatterDetails = () => {
    const { updateCaseInDatabase, fetchCase, toMatterDetails } = useCaseContext();
    const { getUserList, userList } = useUserContext();
    const { fetchCategory, category } = useCategoryContext();
    const caseItem = JSON.parse(localStorage.getItem('caseItem'));
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'solicitorInCharge') {
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
            <Typography variant='h5' sx={{ mt: 3 }}>Edit Matter Details</Typography>
            <Box component="form" sx={{ mt: 2 }}>
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
                        {userList.filter(user => user.role !== 'Solicitor').map(user => (
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
                        {userList.filter(user => user.role !== 'Clerk').map(user => (
                            <MenuItem key={user._id} value={user._id}>
                                {user.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Save Changes
                </Button>
                <Button onClick={toMatterDetails} variant="outlined" sx={{ mt: 2, ml: 2 }}>
                    Cancel
                </Button>
            </Box>
        </Container>
    );
};

export default EditMatterDetails;
