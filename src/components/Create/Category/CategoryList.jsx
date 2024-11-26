import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, CircularProgress, Card, CardContent, Stack } from '@mui/material';
import muiStyles from '../../../styles/muiStyles';

import CategoryCard from './CategoryCard';

import { useCreateContext } from '../../../context/CreateContext';
import { useCategoryContext } from '../../../context/CategoryContext';

const CategoryList = () => {

    const { toNewCategory } = useCreateContext();
    const { categories, categoriesLoaded, fetchCategories } = useCategoryContext();

    useEffect(() => {
        fetchCategories();
    }, []);

    if (!categoriesLoaded) {
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
                    <Box sx={{
                        px: 2,
                        pt: .5,
                        pb: .5,
                    }}>
                        <Typography variant="h6">
                            Categories
                        </Typography>
                    </Box>
                    <Button onClick={toNewCategory} variant="contained" sx={muiStyles.detailsButtonStyle}>
                        New Category
                    </Button>
                </Card>
                <Card sx={{ ...muiStyles.cardStyle, p: 4 }}>
                    {categories.map((category) => (
                        <CategoryCard key={category._id} category={category} />
                    ))}
                </Card>
            </Stack>
        </Container>
    );
};

export default CategoryList;