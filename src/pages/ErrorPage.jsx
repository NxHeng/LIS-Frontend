import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box } from '@mui/material';
import Button from '@mui/material/Button';

const ErrorPage = () => {
    // const navigate = useNavigate();

    // useEffect(() => {
    //     // Optional: Redirect automatically after a delay
    //     const timer = setTimeout(() => {
    //         navigate('/login');
    //     }, 10000); // Redirect after 10 seconds

    //     return () => clearTimeout(timer); // Cleanup timer
    // }, [navigate]);

    return (
        <Box sx={{ textAlign: 'center', mt: '20%' }}>
            <Typography variant="h4" gutterBottom>
                Oops! Page Not Found
            </Typography>
            <Typography variant="body1" gutterBottom>
                The page you are looking for does not exist.
            </Typography>
            {/* <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/login')}
                style={{ marginTop: '20px' }}
            >
                Go to Login
            </Button> */}
        </Box>
    );
};

export default ErrorPage;
