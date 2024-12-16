import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import muiStyles from '../../../styles/muiStyles';

const TaskCard = ({ taskField, onDelete }) => {
    const handleDelete = () => {
        onDelete(taskField._id);
    };

    return (
        <Card
            elevation={3}
            sx={{
                ...muiStyles.cardStyle,
                p: 0,
                pt: 1,
                px: 2,
                mb: 2,
                borderRadius: 3,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',  // Changes cursor to pointer on hover
                transition: 'transform 0.3s ease',  // Smooth transition for zoom effect
                '&:hover': {
                    transform: 'scale(1.05)',  // Slightly scales up the card on hover
                    boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.15)' // Optional: enhance shadow on hover for extra depth
                },
            }}
        >
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="h6">
                    {taskField.description}
                </Typography>
                <IconButton onClick={handleDelete} color="error">
                    <DeleteIcon />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
