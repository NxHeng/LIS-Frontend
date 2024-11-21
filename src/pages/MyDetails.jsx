import React, { useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Stack, Paper } from '@mui/material';

import MatterDetails from '../components/Cases/MatterDetails';
import CaseDetails from '../components/Cases/CaseDetails';
import Documents from '../components/Cases/Documents/Documents';

import { useCaseContext } from '../context/CaseContext';

const MyDetails = () => {

    const { detailView, toMatterDetails, toCaseDetails, toDocuments } = useCaseContext();
    const caseItem = JSON.parse(localStorage.getItem('caseItem'));

    useEffect(() => {
        toMatterDetails();
    }, []);

    return (
        <Box sx={{ p: 2 }}>

            <Box sx={{ ml: 27, mt: 2, minHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    {/* Side Navigation */}
                    <Grid item xs={2}>
                        <Stack>
                            <Typography variant='h2'>Cases</Typography>
                            <Button onClick={toMatterDetails} variant={detailView === 'matterDetails' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                Matter Detail
                            </Button>

                            <Button onClick={toCaseDetails} variant={detailView === 'caseDetails' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                Case Detail
                            </Button>

                            <Button onClick={toDocuments} variant={detailView === 'documents' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                Documents
                            </Button>

                        </Stack>
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={7}>
                        <Container maxWidth="md" sx={{ mt: 10 }}>
                            <Box>
                                {
                                    detailView === 'matterDetails' ? (
                                        <MatterDetails caseItem={caseItem} />
                                    )  : detailView === 'caseDetails' ? (
                                        <CaseDetails caseItem={caseItem} />
                                    )  : detailView === 'documents' ? (
                                        <Documents />
                                    ) : null
                                }
                            </Box>
                        </Container>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default MyDetails;