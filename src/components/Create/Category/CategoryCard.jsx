import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

import { useCreateContext } from '../../../context/CreateContext';

const CategoryCard = ({ category }) => {
    const { toCategoryUpdate } = useCreateContext();

    const handleClick = () => {
        console.log(category._id);
        toCategoryUpdate(category._id);
    };

    return (
        <Card onClick={handleClick} elevation={3} sx={{ marginBottom: 2, borderRadius: 5 }}>
            <CardContent>
                <Typography variant="h6">
                    {category.categoryName}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CategoryCard;