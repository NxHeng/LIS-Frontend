import React from 'react';
import { useState } from 'react';
import { Container, Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const NewCase = () => {

    const [category, setCategory] = useState();
    const categories = ['Housing Project', 'Completed Property', 'Options', 'Loan']

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission
        console.log('Selected category:', category);
    };

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>
                Select Category
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category-select"
                        value={categories[0]}
                        label="Category"
                        onChange={handleCategoryChange}
                    >

                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>
            </Box>
        </Container>
    );
};

export default NewCase;