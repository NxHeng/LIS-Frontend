import React, { useEffect, useState } from 'react';
import { Container, Stack, Typography, CircularProgress, Card, Box, Button, Modal, TextField, FormControl, InputLabel, Select, MenuItem, } from '@mui/material';
import muiStyles from '../../../styles/muiStyles';

import DetailCard from './DetailCard';
import { useFieldContext } from '../../../context/FieldContext';
import { useCreateContext } from '../../../context/CreateContext';

const fieldTypeOptions = ['text', 'date', 'price', 'number', 'stakeholder'];

const DetailList = () => {
    const { fields, fieldsLoaded, fetchFields, deleteField, createField } = useFieldContext();
    // const { toNewDetailField } = useCreateContext();

    const [openModal, setOpenModal] = useState(false);
    const [fieldName, setFieldName] = useState('');
    const [fieldType, setFieldType] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFields();
    }, []);

    const handleDelete = (fieldId) => {
        deleteField(fieldId);
    };

    // Open the modal for creating a new field
    const handleNewFieldClick = () => {
        setOpenModal(true);
    };

    // Close the modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setFieldName('');
        setFieldType('');
    };

    // Handle form submission to create a new field
    const handleSubmit = async () => {
        if (!fieldName || !fieldType) {
            return; // Optional: handle validation errors
        }
        setLoading(true);
        try {
            await createField({ name: fieldName, type: fieldType });
            handleCloseModal();
        } catch (error) {
            console.error('Error creating field:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!fieldsLoaded) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Stack spacing={2}>
                <Card sx={{ ...muiStyles.cardStyle, p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ px: 2, pt: 0.5, pb: 0.5 }}>
                        <Typography variant="h6">Detail Fields</Typography>
                    </Box>
                    <Button onClick={handleNewFieldClick} variant="contained" sx={muiStyles.detailsButtonStyle}>
                        New Field
                    </Button>
                </Card>

                <Card sx={{ ...muiStyles.cardStyle, p: 4 }}>
                    {fields.map((field) => (
                        <DetailCard key={field._id} field={field} onDelete={handleDelete} />
                    ))}
                </Card>
            </Stack>

            {/* Modal for creating a new field */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="new-field-modal-title"
                aria-describedby="new-field-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,  // Set a fixed width to make it smaller
                    bgcolor: 'white',  // White background
                    borderRadius: 2,  // Rounded corners
                    boxShadow: 24,  // Shadow for a nice lift effect
                    p: 3,  // Padding inside the modal
                }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Create New Field
                    </Typography>

                    <TextField
                        label="Field Name"
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Field Type</InputLabel>
                        <Select
                            value={fieldType}
                            onChange={(e) => setFieldType(e.target.value)}
                            label="Field Type"
                        >
                            {fieldTypeOptions.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {/* Capitalise */}
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </MenuItem>
                            ))}
                            {/* Add more field types as needed */}
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCloseModal} color='error' variant='outlined' sx={{ ...muiStyles.detailsButtonStyle,  mr: 1 }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={loading}
                            sx={muiStyles.detailsButtonStyle}
                        >
                            {loading ? 'Creating...' : 'Create Field'}
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </Container>
    );
};

export default DetailList;
