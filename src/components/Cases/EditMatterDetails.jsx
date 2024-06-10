import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TextField } from '@mui/material';

import { useCategoryContext } from '../../context/CategoryContext';
import { useCaseContext } from '../../context/CaseContext';

const EditMatterDetails = () => {
    const { updateCaseInDatabase, fetchCase, toMatterDetails } = useCaseContext();
    const { fetchCategory, category } = useCategoryContext();
    const caseItem = JSON.parse(localStorage.getItem('caseItem'));
    const [editedData, setEditedData] = useState(caseItem);

    useEffect(() => {
        if (caseItem.category) {
            fetchCategory(caseItem.category);
        }
    }, [caseItem.category, fetchCategory]);

    const handleSave = () => {
        updateCaseInDatabase(caseItem._id, editedData);
        // update these specific fields in local storage
        localStorage.setItem('caseItem', JSON.stringify(editedData));
        toMatterDetails();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData({ ...editedData, [name]: value });
    };

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
                <TextField
                    fullWidth
                    label="Clerk In Charge"
                    name="clerkInCharge"
                    value={editedData.clerkInCharge}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Solicitor In Charge"
                    name="solicitorInCharge"
                    value={editedData.solicitorInCharge}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                />
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
