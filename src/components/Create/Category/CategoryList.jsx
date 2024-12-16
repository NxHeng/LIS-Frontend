import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, CircularProgress, Card, CardContent, Stack, Pagination } from '@mui/material';
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

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 7;

    // Calculate total pages
    const totalPages = Math.ceil(categories.length / categoriesPerPage);

    // Get categories for the current page
    const startIndex = (currentPage - 1) * categoriesPerPage;
    const sortedCategories = categories.sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentCategories = sortedCategories.slice(startIndex, startIndex + categoriesPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };


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
                    {currentCategories.map((category) => (
                        <CategoryCard key={category._id} category={category} />
                    ))}
                </Card>
                <Card sx={muiStyles.cardStyle}>
                    <CardContent>
                        {/* Pagination Component */}
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
};

export default CategoryList;