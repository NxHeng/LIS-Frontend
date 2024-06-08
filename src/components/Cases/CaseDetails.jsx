import { Container, Box, Typography, Button } from '@mui/material';
import React from 'react';

const CaseDetails = () => {

    const caseItem = JSON.parse(localStorage.getItem('caseItem'));


    return (
        <Container>
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
                <Button variant="contained" sx={{ mx: 1, borderRadius: 5 }} >
                    Edit
                </Button>
                <Button variant="contained" sx={{ mx: 1, borderRadius: 5 }} >
                    Mark As Closed
                </Button>
                <Button variant="contained" sx={{ mx: 1, borderRadius: 5 }} >
                    Generate Link
                </Button>
            </Box>
            <Box sx={{ mt: 3 }}>
                {caseItem.fields.map(field => (
                    <Box key={field._id} sx={{ mb: 2 }}>
                        <Typography variant='h6' color="grey">
                            {field.name}
                        </Typography>
                        <Typography variant='h6'>
                            {field.value}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Container>
    );
}

export default CaseDetails;