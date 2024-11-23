// jsx setup
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid, Stack, Card, CardContent } from '@mui/material';
import { Add } from '@mui/icons-material';
import LogCard from './LogCard';
import LogDialog from './LogDialog';

import { useCaseContext } from '../../../context/CaseContext';

const CaseLog = ({ logs, caseId }) => {

    const { addLog, deleteLog } = useCaseContext();
    const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
    const [logList, setLogList] = useState(logs); // State to store logs
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user._id : '';

    // Open dialog
    const handleOpenDialog = () => setDialogOpen(true);

    // Close dialog
    const handleCloseDialog = () => setDialogOpen(false);

    // Add log message
    const handleAddLog = (logMessage) => {
        addLog(caseId, logMessage, userId);
        setLogList([...logList, { logMessage, createdBy: userId, createdAt: new Date() }]);
    };

    const handleDeleteLog = (caseId, logId) => {
        deleteLog(caseId, logId); // Perform the API call
        setLogList((prevLogs) => prevLogs.filter((log) => log._id !== logId)); 
    };

    useEffect(() => {
        console.log(logs);
    }, [logList]);

    return (
        <>

            <Card sx={{
                mt: 10,
                p: 2,
                borderRadius: 5,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5">
                            Case Logs
                        </Typography>
                        <Button
                            sx={{
                                borderRadius: '50%',
                                minWidth: '40px',
                                width: '40px',
                                height: '40px',
                                padding: 0,
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#115293',
                                },
                            }}
                            onClick={handleOpenDialog}
                        >
                            <Add style={{ color: 'white', fontSize: '24px' }} />
                        </Button>
                    </Box>
                    <Box sx={{
                        maxHeight: '42vh',
                        overflowY: 'auto',
                    }}>
                        {logList.length > 0 ? (
                            logList.map((log, index) => (
                                <LogCard
                                    key={log._id || index}
                                    log={log}
                                    onDeleteLog={handleDeleteLog}
                                    caseId={caseId}
                                />
                            ))
                        ) : (
                            <Typography variant="body1" color="textSecondary">
                                No logs available
                            </Typography>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Dialog for adding logs */}
            <LogDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onAddLog={handleAddLog}
            />

        </>
    );
};

export default CaseLog;