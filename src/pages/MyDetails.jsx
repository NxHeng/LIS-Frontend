import React, { useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Stack, Divider, Card, CardContent, CircularProgress } from '@mui/material';
import Background from '../components/Background';
import muiStyles from '../styles/muiStyles';

import MatterDetails from '../components/Cases/MatterDetails';
import CaseDetails from '../components/Cases/CaseDetails';
import Documents from '../components/Cases/Documents/Documents';
import ItemDetail from '../components/Cases/Documents/ItemDetail';

import { useCaseContext } from '../context/CaseContext';
import { useDocumentContext } from '../context/DocumentContext';

const MyDetails = () => {

    const { detailView, toMatterDetails, toCaseDetails, toDocuments, isTemporary } = useCaseContext();
    const { selectedFile, handleDelete, handleRename, handleDownload, selectedFolder } = useDocumentContext();
    const caseItem = JSON.parse(localStorage.getItem('caseItem'));

    useEffect(() => {
        toMatterDetails();
    }, []);

    const renderTimeline = () => {
        const tasks = caseItem?.tasks || [];
        // Separate completed and pending tasks
        const completedTasks = tasks.filter(task => task.status === 'Completed').sort((a, b) => a.order - b.order); // Sort completed tasks
        const pendingTasks = tasks.filter(task => task.status !== 'Completed').sort((a, b) => a.order - b.order); // Sort pending tasks

        // Combine the sorted tasks, starting with completed tasks followed by pending tasks
        const sortedTasks = [...completedTasks, ...pendingTasks];
        const status = caseItem?.status === 'closed' ? 'Case Closed' : 'In Progress';

        const Circle = ({ content, completed }) => (
            <Box
                sx={{
                    minWidth: 32,
                    minHeight: 32,
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
                maxHeight: '56vh', // Set max height for the scrollable area
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
        <>
            <Background />
            <Container maxWidth='xl' sx={{ p: 4 }}>
                <Grid container sx={{ flexGrow: 1 }}>
                    {/* Side Navigation */}
                    <Grid item xs={2}>
                        <Card sx={{ ...muiStyles.cardStyle, height: 'auto' }}>
                            <CardContent>
                                <Stack spacing={2}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        px: 2,
                                        pt: 1,
                                        pb: .5,
                                    }}>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                            Cases
                                        </Typography>
                                    </Box>
                                    <Button onClick={toMatterDetails} variant={detailView === 'matterDetails' ? "contained" : "text"} sx={muiStyles.buttonStyle} >
                                        Matter Detail
                                    </Button>

                                    <Button onClick={toCaseDetails} variant={detailView === 'caseDetails' ? "contained" : "text"} sx={muiStyles.buttonStyle} >
                                        Case Detail
                                    </Button>

                                    <Button onClick={toDocuments} variant={detailView === 'documents' ? "contained" : "text"} sx={muiStyles.buttonStyle} >
                                        Documents
                                    </Button>

                                </Stack>
                            </CardContent>
                        </Card>

                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={7}>
                        <Container maxWidth="md">
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
                    {detailView !== 'documents' ? (
                        <Grid item xs={3}>
                            <Card sx={{
                                ...muiStyles.cardStyle,
                                p: 2,
                                height: 'auto',
                            }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Case Status
                                    </Typography>
                                    {renderTimeline()}
                                </CardContent>
                            </Card>
                        </Grid>
                    ) : detailView === 'documents' ? (
                        // Item Detail
                        <Grid item xs={3}>
                            <Box>
                                <ItemDetail
                                    item={selectedFile ? selectedFile : selectedFolder}
                                    handleRename={handleRename}
                                    handleDelete={handleDelete}
                                    handleDownload={handleDownload}
                                    isTemporary={isTemporary}
                                    caseId={caseItem?._id}
                                />
                            </Box>
                        </Grid>
                    ) : null
                    }
                </Grid>
            </Container>

        </>
    );
};

export default MyDetails;