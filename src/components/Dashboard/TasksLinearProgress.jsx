import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const TasksLinearProgress = ({ completedPercentage, pendingPercentage, newTasksPercentage }) => {
    const [animatedWidth, setAnimatedWidth] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setAnimatedWidth(100); // Animate to full width
        }, 100); // Delay to ensure animation triggers smoothly
        return () => clearTimeout(timeout);
    }, []);

    return (
        <Box sx={{ width: '100%', mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Tasks Completion</Typography>
                <Typography variant="subtitle1">
                    {Math.ceil(completedPercentage)}%
                </Typography>
            </Box>
            <Box
                sx={{
                    position: 'relative',
                    height: 12,
                    borderRadius: 8,
                    overflow: 'hidden',
                    backgroundColor: '#e0e0e0', // Neutral background
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        width: `${animatedWidth}%`, // Animate full bar width
                        transition: 'width 1s ease-in-out',
                        background: `linear-gradient(to right, 
                            #4caf50 ${completedPercentage}%, 
                            #81c784 ${completedPercentage}% ${completedPercentage + pendingPercentage}%, 
                            lightgrey ${completedPercentage + pendingPercentage}% 100%)`,
                    }}
                />
            </Box>
        </Box>
    );
};

export default TasksLinearProgress;
