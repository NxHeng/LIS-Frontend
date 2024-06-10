import { Container, Box, Typography, Button } from '@mui/material';
import React from 'react';

import { useCaseContext } from '../../context/CaseContext';

const CaseDetails = () => {

    const { toEditCaseDetails } = useCaseContext();
    const caseItem = JSON.parse(localStorage.getItem('caseItem'));

    return (
        <Container>
            {
                caseItem.status === 'active' || caseItem.status === 'Active' ?
                    <Button onClick={toEditCaseDetails} variant="contained" sx={{ mr: 1, borderRadius: 5, width: "10vh", mb: 3 }} >
                        Edit
                    </Button>
                    : null
            }
            <Box sx={{ display: "flex", justifyContent: "flex-start"}}>
                {/* <Button variant="contained" sx={{ mx: 1, borderRadius: 5 }} >
                    Mark As Closed
                </Button>
                <Button variant="contained" sx={{ mx: 1, borderRadius: 5 }} >
                    Generate Link
                </Button> */}
            </Box>
            <Box>
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