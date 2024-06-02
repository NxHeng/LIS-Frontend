import React from 'react';
import { useState } from 'react';
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { useCreateContext } from '../../context/CreateContext';

const NewCase = () => {

    const { toNewCaseDetails } = useCreateContext();

    const [category, setCategory] = useState();
    // Sample Categories
    const categories = ['Housing Project', 'Completed Property', 'Options', 'Loan']

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const [formData, setFormData] = useState({
        matterName: '',
        fileReference: '',
        solicitorInCharge: '',
        clerkInCharge: '',
        clients: [{ id: 0, value: '' }],
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Clients Fields
    const handleClientChange = (id, event) => {
        const newClients = formData.clients.map(client => {
            if (client.id === id) {
                return { ...client, value: event.target.value };
            }
            return client;
        });
        setFormData({ ...formData, clients: newClients });
    };
    const handleAddClient = () => {
        const newId = formData.clients.length > 0 ? formData.clients[formData.clients.length - 1].id + 1 : 0;
        setFormData({ ...formData, clients: [...formData.clients, { id: newId, value: '' }] });
    };
    const handleRemoveClient = (id) => {
        setFormData({ ...formData, clients: formData.clients.filter(client => client.id !== id) });
    };

    // Form Submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission
        console.log('Selected category:', category);
        console.log('Form Data:', formData);
        toNewCaseDetails();
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>

            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="matterName"
                    label="Matter Name"
                    name="matterName"
                    value={formData.matterName}
                    onChange={handleChange}
                    autoFocus
                    sx={{ mb: 2 }}
                />
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="fileReference"
                    label="File Reference"
                    name="fileReference"
                    value={formData.fileReference}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="solicitorInCharge"
                    label="Solicitor In Charge"
                    name="solicitorInCharge"
                    value={formData.solicitorInCharge}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="clerkInCharge"
                    label="Clerk In Charge"
                    name="clerkInCharge"
                    value={formData.clerkInCharge}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <Typography>
                    Clients
                </Typography>
                {formData.clients.map((client, index) => (
                    <Box key={client.id} sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            value={client.value}
                            onChange={(e) => handleClientChange(client.id, e)}
                            label={`Client ${index + 1}`}
                            sx={{ mb: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleRemoveClient(client.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                ))}
                <Button
                    onClick={handleAddClient}
                    variant="outlined"
                    sx={{ mb: 2, width: '100%' }}
                >
                    Add Client +
                </Button>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category-select"
                        value={categories[0]}
                        label="Category"
                        onChange={handleCategoryChange}
                        sx={{ mb: 2 }}
                    >

                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Continue
                </Button>
            </Box>
        </Container>
    );
};

export default NewCase;