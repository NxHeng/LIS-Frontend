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
        <Card
            onClick={handleClick}
            elevation={3}
            sx={{
                marginBottom: 2,
                borderRadius: 5,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',  // Changes cursor to pointer on hover
                transition: 'transform 0.3s ease',  // Smooth transition for zoom effect
                '&:hover': {
                    transform: 'scale(1.05)',  // Slightly scales up the card on hover
                    boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.15)' // Optional: enhance shadow on hover for extra depth
                }
            }}
        >
            <CardContent>
                <Typography variant="h6">
                    {category.categoryName}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CategoryCard;