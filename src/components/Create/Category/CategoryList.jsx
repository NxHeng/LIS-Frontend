import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';

import CategoryCard from './CategoryCard';

import { useCreateContext } from '../../../context/CreateContext';

const CategoryList = () => {

    const categories = ['Housing Project', 'Completed Property', 'Options', 'Loan']
    const { toNewCategory } = useCreateContext();

    return (
        <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Category List
                </Typography>
                <Button onClick={toNewCategory} variant="contained" color="primary">
                    New Category
                </Button>
            </Box>
            {categories.map((category) => (
                <CategoryCard key={category} category={category} />
            ))}
        </Container>
    );
};

export default CategoryList;