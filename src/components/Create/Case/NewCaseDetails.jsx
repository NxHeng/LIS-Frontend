import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';

import { useCategoryContext } from '../../../context/CategoryContext';
import { useCaseContext } from '../../../context/CaseContext';
import { useNavigate } from 'react-router-dom';
import { useCreateContext } from '../../../context/CreateContext';

const NewCaseDetails = () => {
    const { category } = useCategoryContext();
    const { formData, setFormData, createCase, fetchCases } = useCaseContext();
    const { toNewCase } = useCreateContext();
    const navigate = useNavigate();
    console.log(formData);

    useEffect(() => {
        if (category?.fields) {
            const initialFieldsData = category.fields.map(field => ({
                name: field.name,
                value: '', // Initialize with an empty string or a default value
                _id: field._id
            }));

            // Update formData to include the category ID and the fields
            setFormData(currentData => ({
                ...currentData,
                categoryId: category._id,
                fields: initialFieldsData
            }));
        }
    }, [category, setFormData]);

    const handleFieldChange = (id, event) => {
        const { value } = event.target;
        setFormData(currentData => ({
            ...currentData,
            fields: currentData.fields.map(field =>
                field._id === id ? { ...field, value: value } : field
            )
        }));
    };


    const handleSubmit = (event) => {
        event.preventDefault();

        const transformedData = {
            categoryId: formData.categoryId,  // Use categoryId as the key
            matterName: formData.matterName,
            fileReference: formData.fileReference,
            solicitorInCharge: formData.solicitorInCharge,
            clerkInCharge: formData.clerkInCharge,
            clients: formData.clients.map(client => client.value),  // Extract values from clients array
            fieldValues: formData.fields.map(field => field.value)  // Extract values from fields array
        };

        //clear form
        setFormData({
            matterName: '',
            fileReference: '',
            solicitorInCharge: '',
            clerkInCharge: '',
            clients: [{ id: 0, value: '' }],
            categoryId: '',
            fields: []
        });

        createCase(transformedData);
        fetchCases();
        console.log('Transformed Data:', transformedData);
        toNewCase();
        navigate('/cases');
    };


    const getTypeDescription = (type) => {
        switch (type) {
            case 'number': return 'Numeric value';
            case 'string': default: return 'Text';
        }
    };

    return (
        <Container>
            <Typography variant='h5' sx={{ mb: 2 }}>Case Details</Typography>

            <Box component="form" onSubmit={handleSubmit}>
                {formData.fields.map((field, index) => (
                    <TextField
                        key={field._id}
                        variant="outlined"
                        required
                        fullWidth
                        label={`${field.name} (${getTypeDescription(field.type)})`}
                        value={field.value}
                        onChange={(e) => handleFieldChange(field._id, e)}
                        type={typeof field.value === 'number' ? 'number' : 'text'}
                        autoFocus={index === 0}
                        sx={{ mb: 2 }}
                    />
                ))}

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Create Case
                </Button>
            </Box>
        </Container>
    );
};

export default NewCaseDetails;
