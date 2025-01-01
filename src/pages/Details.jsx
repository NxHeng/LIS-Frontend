import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Container, Typography, Box, Button, Grid, Stack, Card, CardContent } from '@mui/material';

import MatterDetails from '../components/Cases/MatterDetails';
import EditMatterDetails from '../components/Cases/EditMatterDetails';
import CaseDetails from '../components/Cases/CaseDetails';
import EditCaseDetails from '../components/Cases/EditCaseDetails';
import Tasks from '../components/Cases/Tasks/Tasks';
import TaskDetail from '../components/Cases/Tasks/TaskDetail';
import AddTaskBar from '../components/Cases/Tasks/AddTaskBar';
import Documents from '../components/Cases/Documents/Documents';
import CaseLog from '../components/Cases/CaseLog/CaseLog';
import ItemDetail from '../components/Cases/Documents/ItemDetail';
import muiStyles from '../styles/muiStyles';
import Background from '../components/Background';

import { useCaseContext } from '../context/CaseContext';
import { useTaskContext } from '../context/TaskContext';
import { useDocumentContext } from '../context/DocumentContext';

const Details = () => {

    const { detailView, toMatterDetails, toEditMatterDetails, toCaseDetails, toTasks, toDocuments, fromTasks, fromNotificationsToTasks, fromNotificationsToCaseDetails, setFromTasks, setFromNotificationsToTasks, setFromNotificationsToCaseDetails, setIsTemporary, isTemporary, fetchCase } = useCaseContext();
    const { selectedFile, selectedFolder, handleRename, handleDelete, handleDownload, deleteDialogOpen, closeDeleteDialog, openDeleteDialog } = useDocumentContext();
    const { task } = useTaskContext();
    const token = localStorage.getItem('token');

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [caseItem, setCaseItem] = useState(() => {
        // Initialize state from localStorage
        const savedCase = localStorage.getItem('caseItem');
        return savedCase ? JSON.parse(savedCase) : null;
    });

    useEffect(() => {
        const loadCaseData = async () => {
            try {
                setLoading(true);
                const data = await fetchCase(id, token); // Wait for the data to be fetched
                setCaseItem(data); // Update caseItem with the fetched data
            } catch (error) {
                console.error("Error fetching case data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!caseItem || caseItem._id !== id) {
            loadCaseData(); // Call the function to fetch data
        }
    }, [id]);

    const handleUpdatedCase = (updatedCase) => {
        setCaseItem(updatedCase);
    };

    useEffect(() => {
        setIsTemporary(false);
        toMatterDetails();
    }, []);

    useEffect(() => {
        if (fromTasks || fromNotificationsToTasks) {
            toTasks();
        }
        else if (fromNotificationsToCaseDetails) {
            toCaseDetails();
        }

        setFromTasks(false);
        setFromNotificationsToTasks(false);
        setFromNotificationsToCaseDetails(false);

    }, [fromTasks, fromNotificationsToTasks, fromNotificationsToCaseDetails]);

    if (!caseItem && loading) {
        return <div>Loading...</div>
    }


    return (
        <>
            <Background />
            <Container maxWidth='xl' sx={{ p: 4 }}>
                <Grid container spacing={2}>
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
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', }}>
                                            Cases
                                        </Typography>
                                    </Box>
                                    <Button onClick={toMatterDetails} variant={detailView === 'matterDetails' ? "contained" : "text"} sx={muiStyles.buttonStyle} >
                                        Matter Detail
                                    </Button>

                                    <Button onClick={toCaseDetails} variant={detailView === 'caseDetails' ? "contained" : "text"} sx={muiStyles.buttonStyle} >
                                        Case Detail
                                    </Button>

                                    <Button onClick={toTasks} variant={detailView === 'tasks' ? "contained" : "text"} sx={muiStyles.buttonStyle} >
                                        Tasks
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
                        <Box>
                            {
                                detailView === 'matterDetails' ? (
                                    <MatterDetails caseItem={caseItem} />
                                ) : detailView === 'editMatterDetails' ? (
                                    <EditMatterDetails caseItem={caseItem} onSave={handleUpdatedCase} />
                                ) : detailView === 'caseDetails' ? (
                                    <CaseDetails caseItem={caseItem} />
                                ) : detailView === 'editCaseDetails' ? (
                                    <EditCaseDetails caseItem={caseItem} onSave={handleUpdatedCase} />
                                ) : detailView === 'tasks' ? (
                                    <Tasks />
                                ) : detailView === 'documents' ? (
                                    <Documents />
                                ) : null
                            }
                        </Box>
                    </Grid>
                    {
                        detailView === 'tasks' ? (
                            <Grid item xs={3} sx={{ height: "auto" }}>
                                <TaskDetail />
                            </Grid>
                        ) : detailView === 'matterDetails' || detailView === 'caseDetails' ? (
                            <Grid item xs={3} sx={{ pr: 3 }}>
                                <CaseLog logs={caseItem?.logs} caseId={caseItem?._id} />
                            </Grid>
                        ) : detailView === 'documents' ? (
                            <Grid item xs={3}>
                                <Box>
                                    <ItemDetail
                                        item={selectedFile ? selectedFile : selectedFolder}
                                        handleRename={handleRename}
                                        handleDelete={handleDelete}
                                        handleDownload={handleDownload}
                                        isTemporary={isTemporary}
                                        caseId={caseItem?._id}
                                        openDeleteDialog={openDeleteDialog}
                                        closeDeleteDialog={closeDeleteDialog}
                                        deleteDialogOpen={deleteDialogOpen}
                                    />
                                </Box>
                            </Grid>
                        ) : null
                    }
                </Grid>
            </Container>
            {
                detailView === 'tasks' && (caseItem?.status === 'active' || caseItem?.status === 'Active') ? (
                    <AddTaskBar />
                ) : null
            }
        </>
    );
};

export default Details;