// jsx setup
import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid, Stack, Card, CardContent } from '@mui/material';
import { Add } from '@mui/icons-material';
import LogCard from './LogCard';
import LogDialog from './LogDialog';
import muiStyles from '../../../styles/muiStyles';
import DeleteDialog from '../../DeleteDialog';

import { useCaseContext } from '../../../context/CaseContext';

const CaseLog = ({ logs, caseId }) => {

    const { addLog, deleteLog } = useCaseContext();
    const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedLogId, setSelectedLogId] = useState(null); // Track log ID for deletion

    const [logList, setLogList] = useState(logs); // State to store logs
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user._id : '';

    // Open dialog
    const handleOpenDialog = () => setDialogOpen(true);

    // Close dialog
    const handleCloseDialog = () => setDialogOpen(false);

    // Add log message
    const handleAddLog = (logMessage) => {
        addLog(caseId, logMessage, userId, token);
        setLogList([...logList, { logMessage, createdBy: userId, createdAt: new Date() }]);
    };

    const handleDeleteLog = (caseId, logId) => {
        deleteLog(caseId, logId, token); // Perform the API call
        setLogList((prevLogs) => prevLogs.filter((log) => log._id !== logId));
        closeDeleteDialog();
    };

    const handleDeleteClick = (logId) => {
        setSelectedLogId(logId); // Set the selected log ID
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSelectedLogId(null); // Clear the selected log ID
    };

    return (
        <>
            <DeleteDialog
                deleteDialogOpen={deleteDialogOpen}
                closeDeleteDialog={closeDeleteDialog}
                confirmDelete={handleDeleteLog} 
                isLog={true}
                caseId={caseId}
                logId={selectedLogId} // Pass selected log ID
            />
            
            <Card sx={{ ...muiStyles.cardStyle, height: 'auto' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            px: 1,
                            pt: 1,
                        }}>
                            <Typography variant="h5">
                                Case Logs
                            </Typography>
                        </Box>
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
                        maxHeight: '54vh',
                        overflowY: 'auto',
                        py: 1,
                    }}>
                        {logList?.length > 0 ? (
                            logList?.map((log, index) => (
                                <LogCard
                                    key={log._id || index}
                                    log={log}
                                    onDeleteLog={() => handleDeleteClick(log._id)} // Pass log ID for deletion
                                // caseId={caseId}
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