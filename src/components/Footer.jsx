import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';

const Footer = () => {

    return (
        <Box component="footer" sx={{ position: 'fixed', bottom: 0, width: '100%', padding: '2em', backgroundColor: 'lightgrey' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="space-between">
                    <Grid item xs={12} sm={8} md={9}>
                        <Typography variant="h6" gutterBottom>
                            Legal Information System
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Contact: info@example.com | +012 345 6789
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Address: 123 Legal St, Law City, Malaysia
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Footer;
