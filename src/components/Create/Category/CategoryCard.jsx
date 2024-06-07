import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

import { useCreateContext } from '../../../context/CreateContext';

const CategoryCard = ({ category }) => {
    const { toCategoryUpdate } = useCreateContext();
    return (
        <Card onClick={toCategoryUpdate} elevation={3} sx={{ marginBottom: 2, borderRadius: 5 }}>
            <CardContent>
                <Typography variant="h6">
                    {category.categoryName}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CategoryCard;