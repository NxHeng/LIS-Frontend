import { Container, Box, Typography, Button } from '@mui/material';
import React from 'react';

const CaseDetails = ({ caseItem }) => {
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
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <Typography variant='h6' color="grey">
                        Matter Name
                    </Typography>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        {caseItem.title}
                    </Typography>

                    <Typography variant='h6' color="grey">
                        File Reference
                    </Typography>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        {caseItem.id}
                    </Typography>

                    <Typography variant='h6' color="grey">
                        Clerk In Charge
                    </Typography>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        {caseItem.title}
                    </Typography>

                </Box>
                <Box>
                    <Typography variant='h6' color="grey">
                        Category
                    </Typography>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        {caseItem.title}
                    </Typography>

                    <Typography variant='h6' color="grey">
                        Status
                    </Typography>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        {caseItem.title}
                    </Typography>

                    <Typography variant='h6' color="grey">
                        Solicitor In Charge
                    </Typography>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        {caseItem.title}
                    </Typography>

                </Box>
            </Box>
        </Container>
    );
}

export default CaseDetails;