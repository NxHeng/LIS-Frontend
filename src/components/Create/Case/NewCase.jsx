import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { useCreateContext } from '../../../context/CreateContext';
import { useCategoryContext } from '../../../context/CategoryContext';
import { useCaseContext } from '../../../context/CaseContext';
import { useUserContext } from '../../../context/UserContext';

const NewCase = () => {

    const { toNewCaseDetails } = useCreateContext();
    const { formData, setFormData } = useCaseContext();
    const { fetchCategories, categories, setCategory, category, categoriesLoaded, categoryLoaded, setCategoryLoaded } = useCategoryContext();
    const { userList, getUserList } = useUserContext();
    
    // const [solicitor, setSolicitor] = useState('');
    // const [clerk, setClerk] = useState('');

    useEffect(() => {
        fetchCategories();
        setFormData({
            matterName: '',
            fileReference: '',
            solicitorInCharge: '',
            clerkInCharge: '',
            clients: [],
            categoryId: '',
            fields: [],
        });
    }, []);

    useEffect(() => {
        if (categoriesLoaded && categories.length > 0) {
            console.log('Categories:', categories);
            setCategory(categories[0]);
            setCategoryLoaded(true);
        }
    }, [categoriesLoaded, categories]);

    useEffect(() => {
        getUserList();
    }, []);

    //
    // useEffect(() => {
    //     console.log('Selected category:', category);
    // }, [categoryLoaded, category]);

    const handleCategoryChange = (event) => {
        const selectedCategory = categories.find(
            cat => cat._id === event.target.value
        );
        setCategory(selectedCategory);
    };

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
        const transformedClients = formData.clients.map(({ value }) => value);
        const finalFormData = { ...formData, clients: transformedClients };
        console.log('Form Data:', finalFormData);
        // console.log('Selected category:', category);
        toNewCaseDetails();
        // clear the form
        // setFormData({
        //     matterName: '',
        //     fileReference: '',
        //     solicitorInCharge: '',
        //     clerkInCharge: '',
        //     clients: [],
        //     categoryId: '',
        //     fields: [],
        // });
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            {userList.map((user) => (
                <Typography key={user._id}>
                    {user.name}
                </Typography>
            ))}

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
                {/* <TextField
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
                /> */}

                <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                    <InputLabel id="solicitor-label">Solicitor In Charge</InputLabel>
                    <Select
                        labelId="solicitor-label"
                        id="solicitor-select"
                        value={formData.solicitorInCharge}
                        label="Solicitor In Charge"
                        name="solicitorInCharge"
                        onChange={handleChange}
                    >
                        {/* change to === after roles are applied */}
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
                        value={formData.clerkInCharge}
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
                        value={categoryLoaded && category ? category._id : ''}
                        label="Category"
                        onChange={handleCategoryChange}
                        sx={{ mb: 2 }}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category._id} value={category._id}>
                                {category.categoryName}
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