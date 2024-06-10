import React, { useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

import { useCategoryContext } from '../../context/CategoryContext';
import { useCaseContext } from '../../context/CaseContext';
import { useNavigate } from 'react-router-dom';

const MatterDetails = () => {

    const { updateCaseAsClosedInDatabase, toEditMatterDetails } = useCaseContext();
    const { fetchCategory, category } = useCategoryContext();
    const caseItem = JSON.parse(localStorage.getItem('caseItem'));
    const navigate = useNavigate();

    useEffect(() => {
        console.log(caseItem.status);
        fetchCategory(caseItem.category);
    }, []);

    const handleClose = () => {
        updateCaseAsClosedInDatabase(caseItem._id);
        navigate('/cases');
    }

    const handleEdit = () => {
        toEditMatterDetails();
    }

    return (
        <Container>
            {
                caseItem.status === 'active' || caseItem.status === 'Active'  ? <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
                    <Button onClick={handleEdit} variant="contained" sx={{ mr: 1, borderRadius: 5, width: "10vh" }} >
                        Edit
                    </Button>
                    <Button onClick={handleClose} variant="contained" sx={{ mx: 1, borderRadius: 5 }} >
                        Mark As Closed
                    </Button>
                    <Button variant="contained" sx={{ mx: 1, borderRadius: 5 }} >
                        Generate Link
                    </Button>
                </Box> : null
            }

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <Typography variant='h6' color="grey">
                        Matter Name
                    </Typography>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        {caseItem.matterName}
                    </Typography>

                    <Typography variant='h6' color="grey">
                        File Reference
                    </Typography>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        {caseItem.fileReference}
                    </Typography>

                    <Typography variant='h6' color="grey">
                        Clerk In Charge
                    </Typography>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        {caseItem.clerkInCharge}
                    </Typography>

                </Box>
                <Box>
                    <Typography variant='h6' color="grey">
                        Category
                    </Typography>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        {category.categoryName}
                    </Typography>

                    <Typography variant='h6' color="grey">
                        Status
                    </Typography>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        {caseItem.status}
                    </Typography>

                    <Typography variant='h6' color="grey">
                        Solicitor In Charge
                    </Typography>
                    <Typography variant='h6' sx={{ mb: 2 }}>
                        {caseItem.solicitorInCharge}
                    </Typography>

                </Box>
            </Box>
        </Container>
    );
}

export default MatterDetails;