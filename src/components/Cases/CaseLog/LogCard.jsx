// jsx setup
import React from 'react';
import { Container, Typography, Box, Button, Grid, Stack, Card, CardContent } from '@mui/material';
import { Delete } from '@mui/icons-material';

const LogCard = ({ log, onDeleteLog, caseId }) => {

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    return (
        <Card elevation={0} sx={{
            mt: 2,
            pt: 1,
            borderRadius: 5,
            border: '1px solid #e0e0e0',
        }}>
            <CardContent>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                        {formatDate(log.createdAt)}
                    </Typography>
                    <Delete onClick={() => onDeleteLog(caseId, log._id)} color="disabled" sx={{ cursor: 'pointer' }} />
                </Box>
                <Typography variant="body1">
                    {log.logMessage}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default LogCard;