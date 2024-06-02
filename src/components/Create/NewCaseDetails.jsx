import React from 'react';
import { useState } from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';

const NewCaseDetails = () => {

    const [formData, setFormData] = useState('');
    const handleChange = (event) => {
        setFormData(event.target.value);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form Data:', formData);
    }
    return (
        <Container>
            <Typography variant='h5' sx={{ mb: 2 }}>Case Details</Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="field1"
                    label="Field 1"
                    name="field1"
                    value={''}
                    onChange={handleChange}
                    autoFocus
                    sx={{ mb: 2 }}
                />

                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Create Case
                </Button>
            </Box>
        </Container>
    );
};

export default NewCaseDetails;