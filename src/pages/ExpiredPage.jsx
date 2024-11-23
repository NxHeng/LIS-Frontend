import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import Button from '@mui/material/Button';

const ExpiredPage = () => {
    return (
        <Box sx={{ textAlign: 'center', mt: '20%' }}>
            <Typography variant="h4" gutterBottom>
                Woops! Page Expired
            </Typography>
            <Typography variant="body1" gutterBottom>
                The page you are looking for is expired.
            </Typography>
        </Box>
    );
};

export default ExpiredPage;
