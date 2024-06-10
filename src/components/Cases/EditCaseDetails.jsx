import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, TextField } from '@mui/material';

import { useCaseContext } from '../../context/CaseContext';
import { useCategoryContext } from '../../context/CategoryContext';

const EditCaseDetails = () => {
    const { updateCaseInDatabase, toCaseDetails } = useCaseContext();
    const { fetchCategory, category } = useCategoryContext();
    const [caseData, setCaseData] = useState(null);

    useEffect(() => {
        const caseItem = JSON.parse(localStorage.getItem('caseItem'));
        fetchCategory(caseItem.category).then(() => {
            setCaseData(caseItem);
        });
    }, []);

    const handleChange = (fieldId, value) => {
        const newFields = caseData.fields.map(field =>
            field._id === fieldId ? { ...field, value: value } : field
        );
        setCaseData({ ...caseData, fields: newFields });
    };

    const handleSave = () => {
        updateCaseInDatabase(caseData._id, caseData);
        localStorage.setItem('caseItem', JSON.stringify(caseData));
        toCaseDetails();
    };

    const handleCancel = () => {
        toCaseDetails();
    };

    if (!caseData) {
        return <Container><Typography>Loading...</Typography></Container>;
    }

    return (
        <Container>
            <Typography variant='h4' sx={{ mb: 2 }}>Edit Case Details</Typography>
            <Box component="form" sx={{ mt: 2 }}>
                {caseData.fields.map((field) => {
                    const categoryField = category.fields.find(catField => catField.name === field.name);
                    const fieldType = categoryField ? categoryField.type : 'text';

                    return (
                        <TextField
                            key={field._id}
                            label={field.name}
                            variant="outlined"
                            type={fieldType === 'number' ? 'number' : 'text'}
                            fullWidth
                            value={field.value}
                            onChange={(e) => handleChange(field._id, e.target.value)}
                            margin="normal"
                        />
                    );
                })}
                <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outlined" sx={{ mt: 2, ml: 2 }}>
                    Cancel
                </Button>
            </Box>
        </Container>
    );
};

export default EditCaseDetails;
