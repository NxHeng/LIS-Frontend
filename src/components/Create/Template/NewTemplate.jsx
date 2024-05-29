import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';

const NewTemplate = () => {

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
                    New Template
                </Typography>
            </Box>
        </Container>
    );
};

export default NewTemplate;