import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, TextField, Stack, InputAdornment, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useCaseContext } from '../../context/CaseContext';
import { useCategoryContext } from '../../context/CategoryContext';

const EditCaseDetails = ({ caseItem }) => {
    const { updateCaseInDatabase, toCaseDetails } = useCaseContext();
    const { fetchCategory, category } = useCategoryContext();
    const [caseData, setCaseData] = useState(null);

    useEffect(() => {
        // const caseItem = JSON.parse(localStorage.getItem('caseItem'));
        fetchCategory(caseItem.category).then(() => {
            setCaseData(caseItem);
        });
    }, []);

    const handleFieldChange = (fieldId, key, value) => {
        // const newFields = caseData.fields.map(field =>
        //     field._id === fieldId ? { ...field, value: value } : field
        // );
        // setCaseData({ ...caseData, fields: newFields });
        setCaseData(currentData => ({
            ...currentData,
            fields: currentData.fields.map(field =>
                field._id === fieldId ? { ...field, [key]: value } : field
            )
        }));
    };

    const handleDateChange = (id, date) => {
        console.log('Date:', date);
        setCaseData(currentData => ({
            ...currentData,
            fields: currentData.fields.map(field =>
                field._id === id ? { ...field, value: date.toISOString() } : field
            )
        }));
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
            <Stack direction="column" spacing={2} component="form" sx={{ mt: 2 }}>
                {caseData.fields.map((field) => (
                    <Grid container spacing={2} alignItems="flex-start" key={field._id}>
                        {/* Main field */}
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
                        {/* Additional Fields */}
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
                <Stack direction="row" spacing={2}>
                    <Button onClick={handleSave} variant="contained" color="primary" fullWidth>
                        Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outlined" fullWidth>
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </Container>
    );
};

export default EditCaseDetails;
