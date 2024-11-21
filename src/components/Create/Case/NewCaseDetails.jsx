import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, Stack, InputAdornment, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

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
                value: field.type === 'text' || field.type === 'stakeholder' ? '' : 0,
                type: field.type,
                _id: field._id,
                tel: field.tel,
                email: field.email,
                fax: field.fax,
                remarks: field.remarks
            }));

            // Update formData to include the category ID and the fields
            setFormData(currentData => ({
                ...currentData,
                categoryId: category._id,
                fields: initialFieldsData
            }));
        }
    }, [category, setFormData]);

    const handleFieldChange = (id, key, value) => {
        setFormData(currentData => ({
            ...currentData,
            fields: currentData.fields.map(field =>
                field._id === id ? { ...field, [key]: value } : field
            )
        }));
    };

    const handleDateChange = (id, date) => {
        console.log('Date:', date);
        setFormData(currentData => ({
            ...currentData,
            fields: currentData.fields.map(field =>
                field._id === id ? { ...field, value: date.toISOString() } : field
            )
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const transformedData = {
            categoryId: formData.categoryId,
            matterName: formData.matterName,
            fileReference: formData.fileReference,
            solicitorInCharge: formData.solicitorInCharge,
            clerkInCharge: formData.clerkInCharge,
            clients: formData.clients.map(({ name, icNumber }) => ({ name, icNumber })),
            fieldValues: formData.fields.map(field => ({
                value: field.value,
                remarks: field.remarks,
                tel: field.tel,
                email: field.email,
                fax: field.fax
            }))
        };

        //clear form
        setFormData({
            matterName: '',
            fileReference: '',
            solicitorInCharge: '',
            clerkInCharge: '',
            clients: [{ id: 0, name: '', icNumber: '' }],
            categoryId: '',
            fields: []
        });
        console.log('Transformed Data::::', transformedData);
        createCase(transformedData);
        fetchCases();
        console.log('Transformed Data:', transformedData);
        toNewCase();
        navigate('/cases');
    };

    const getTypeDescription = (type) => {
        switch (type) {
            case 'number': return 'Numeric value';
            case 'text': default: return 'Text';
        }
    };

    return (
        <Container>
            <Typography variant='h5' sx={{ mb: 2 }}>Case Details</Typography>

            <Box component="form" onSubmit={handleSubmit}>

                {formData.fields.map((field) => (
                    <Grid container spacing={2} alignItems="flex-start" key={field._id}>
                        {/* Main value field */}
                        <Grid item xs={12} sm={6} md={3} sx={{ mb: 2 }}>
                            {field.type === 'date' ? (
                                <LocalizationProvider dateAdapter={AdapterDateFns} >
                                    <DatePicker
                                        label={field.name}
                                        value={field.value ? new Date(field.value) : null}
                                        fullWidth
                                        onChange={(date) => handleDateChange(field._id, date)}
                                    />
                                </LocalizationProvider>
                            ) : (
                                <TextField
                                    label={field.name}
                                    value={field.value}
                                    onChange={(e) => handleFieldChange(field._id, 'value', e.target.value)}
                                    fullWidth
                                    type={
                                        field.type === 'text' || field.type === 'stakeholder'
                                            ? 'text'
                                            : 'number'
                                    }
                                    InputProps={
                                        field.type === 'price'
                                            ? {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        RM
                                                    </InputAdornment>
                                                ),
                                                inputProps: { min: 0, step: "0.01" }
                                            } : {}
                                    }
                                />
                            )}
                        </Grid>

                        {/* Additional fields */}
                        {field.type === 'stakeholder' ? (
                            <>
                                <Grid item xs={12} sm={6} md={3} sx={{ mb: 2 }}>
                                    <TextField
                                        label="Tel"
                                        value={field.tel}
                                        onChange={(e) => handleFieldChange(field._id, 'tel', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} sx={{ mb: 2 }}>
                                    <TextField
                                        label="Email"
                                        value={field.email}
                                        onChange={(e) => handleFieldChange(field._id, 'email', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3} sx={{ mb: 2 }}>
                                    <TextField
                                        label="Fax"
                                        value={field.fax}
                                        onChange={(e) => handleFieldChange(field._id, 'fax', e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                            </>
                        ) : (
                            <Grid item xs={12} sm={6} md={9} sx={{ mb: 2 }}>
                                <TextField
                                    label="Remarks"
                                    value={field.remarks}
                                    onChange={(e) => handleFieldChange(field._id, 'remarks', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        )}
                    </Grid>
                ))}
                <Grid item xs={12} sm={12} md={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Create Case
                    </Button>
                </Grid>
            </Box>
        </Container >
    );
};

export default NewCaseDetails;
