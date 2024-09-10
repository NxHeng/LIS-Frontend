import React, { useEffect } from 'react';
import { Container, Typography, Box, Button, Grid, Stack, Paper } from '@mui/material';

import MatterDetails from '../components/Cases/MatterDetails';
import EditMatterDetails from '../components/Cases/EditMatterDetails';
import CaseDetails from '../components/Cases/CaseDetails';
import EditCaseDetails from '../components/Cases/EditCaseDetails';
import Tasks from '../components/Cases/Tasks/Tasks';
import TaskDetail from '../components/Cases/Tasks/TaskDetail';
import AddTaskBar from '../components/Cases/Tasks/AddTaskBar';
import Documents from '../components/Cases/Documents';

import { useCaseContext } from '../context/CaseContext';
import { useTaskContext } from '../context/TaskContext';
import { Edit } from '@mui/icons-material';

const Details = () => {

    const { detailView, toMatterDetails, toEditMatterDetails, toCaseDetails, toTasks, toDocuments, fromTasks, setFromTasks} = useCaseContext();
    const { task } = useTaskContext();
    const caseItem = JSON.parse(localStorage.getItem('caseItem'));

    useEffect(() => {
        toMatterDetails();
    }, []);

    useEffect(() => {
        if (fromTasks) {
            toTasks();  // Ensure this sets the view to tasks
              // Reset after triggering the switch
        }
    }, [fromTasks]);
    

    return (
        <div sx={{ p: 2 }}>

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

                            <Button onClick={toTasks} variant={detailView === 'tasks' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                Tasks
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
                                    ) : detailView === 'editMatterDetails' ? (
                                        <EditMatterDetails caseItem={caseItem} />
                                    ) : detailView === 'caseDetails' ? (
                                        <CaseDetails caseItem={caseItem} />
                                    ) : detailView === 'editCaseDetails' ? (
                                        <EditCaseDetails caseItem={caseItem} />
                                    ) : detailView === 'tasks' ? (
                                        <Tasks />
                                    ) : detailView === 'documents' ? (
                                        <Documents />
                                    ) : null
                                }
                            </Box>
                        </Container>
                    </Grid>
                    {
                        detailView === 'tasks' ? (
                            <Grid item xs={3} sx={{ backgroundColor: "#f8f9fa", height: "100vh%" }}>
                                <TaskDetail />
                            </Grid>
                        ) : null
                    }

                </Grid>
            </Box>
            {
                detailView === 'tasks' && (caseItem.status === 'active' || caseItem.status === 'Active') ? (
                    <AddTaskBar />
                ) : null
            }
        </div>
    );
};

export default Details;