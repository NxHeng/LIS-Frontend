import React, { useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Stack, Divider, Card, CardContent, CircularProgress } from '@mui/material';

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

    const renderTimeline = () => {
        const tasks = caseItem.tasks || [];
        // Separate completed and pending tasks
        const completedTasks = tasks.filter(task => task.status === 'Completed').sort((a, b) => a.order - b.order); // Sort completed tasks
        const pendingTasks = tasks.filter(task => task.status !== 'Completed').sort((a, b) => a.order - b.order); // Sort pending tasks

        // Combine the sorted tasks, starting with completed tasks followed by pending tasks
        const sortedTasks = [...completedTasks, ...pendingTasks];
        const status = caseItem.status === 'closed' ? 'Case Closed' : 'In Progress';

        const Circle = ({ content, completed }) => (
            <Box
                sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: completed ? 'green' : 'grey',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: 16,
                }}
            >
                {content}
            </Box>
        );

        return (
            <Box sx={{
                maxHeight: '42vh', // Set max height for the scrollable area
                overflowY: 'auto', // Enable vertical scrolling
                paddingBottom: 2, // Space at the bottom of the scroll area
            }}>
                <Stack spacing={2}>

                    {/* Case Created Row */}
                    <Box display="flex" alignItems="center">
                        <Circle content="✔" completed={true} />
                        <Typography variant="body1" sx={{ ml: 2 }}>Case Created</Typography>
                    </Box>

                    {/* Loop through tasks */}
                    {sortedTasks.map((task, index) => (
                        <Box key={task._id} display="flex" alignItems="center" position="relative">
                            {/* Calculate dynamic index: add 1 for "Case Created" */}
                            <Circle
                                content={task.status === 'Completed' ? "✔" : index + 2} // Offset index to account for "Case Created"
                                completed={task.status === 'Completed'}
                            />
                            <Typography variant="body1" sx={{ ml: 2 }}>
                                {task.description}
                            </Typography>
                        </Box>
                    ))}

                    {/* Case Closed Row */}
                    <Box display="flex" alignItems="center">
                        <Circle
                            content={tasks.length + 2} // Last index after all tasks
                            completed={status === 'Case Closed'}
                        />
                        <Typography variant="body1" sx={{ ml: 2 }}>
                            Case Closed
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        );
    };

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
                                    ) : detailView === 'caseDetails' ? (
                                        <CaseDetails caseItem={caseItem} />
                                    ) : detailView === 'documents' ? (
                                        <Documents />
                                    ) : null
                                }
                            </Box>
                        </Container>
                    </Grid>

                    {/* Case Status Card */}
                    <Grid item xs={3}>
                        <Card sx={{
                            mt: 10,
                            p: 2,
                            borderRadius: 5,
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        }}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Case Status
                                </Typography>
                                {renderTimeline()}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default MyDetails;