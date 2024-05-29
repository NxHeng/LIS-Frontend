import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';

import TemplateCard from './TemplateCard';

import { useCreateContext } from '../../../context/CreateContext';

const TemplateList = () => {

    const categories = ['Template 1', 'Template 2', 'Template 3', 'Template 4']
    const { toNewTemplate } = useCreateContext();

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
                    Template List
                </Typography>
                <Button onClick={toNewTemplate} variant="contained" color="primary">
                    New Template
                </Button>
            </Box>
            {categories.map((template) => (
                <TemplateCard key={template} template={template} />
            ))}
        </Container>
    );
};

export default TemplateList;