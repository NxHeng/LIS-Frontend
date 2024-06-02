import React from 'react';
import { Container, Typography, Box, Button, Grid, Stack } from '@mui/material';

import MatterDetails from '../components/Cases/MatterDetails';
import CaseDetails from '../components/Cases/CaseDetails';
import Tasks from '../components/Cases/Tasks';
import Documents from '../components/Cases/Documents';

import { useCaseContext } from '../context/CaseContext';

const Details = () => {

    const { detailView, toMatterDetails, toCaseDetails, toTasks, toDocuments } = useCaseContext();
    const caseItem = JSON.parse(localStorage.getItem('caseItem'));

    return (
        <Container sx={{ p: 2 }}>
            <Typography variant='h2'>Cases</Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {/* Side Navigation */}
                    <Grid item xs={3}>
                        <Stack>

                            <Button onClick={toMatterDetails} variant={detailView === 'matterDetails' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                Matter Detail
                            </Button>

                            <Button onClick={toCaseDetails} variant={detailView === 'caseDetails' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                Case Detail
                            </Button>

                            <Button onClick={toTasks} variant={detailView === 'tasks' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                Tasks
                            </Button>

                            <Button onClick={toDocuments} variant={detailView === 'documents' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                Documents
                            </Button>

                        </Stack>
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={9}>
                        <Container maxWidth="md">
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

                            <Box>
                                {
                                    detailView === 'matterDetails' ? (
                                        <MatterDetails caseItem={caseItem} />
                                    ) : detailView === 'caseDetails' ? (
                                        <CaseDetails caseItem={caseItem} />
                                    ) : detailView === 'tasks' ? (
                                        <Tasks />
                                    ) : detailView === 'documents' ? (
                                        <Documents />
                                    ) : null
                                }
                            </Box>
                        </Container>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Details;