import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const CaseCard = ({ caseItem }) => {

    const [firstTask, setFirstTask] = useState(null);

    const handleClick = () => {
        localStorage.setItem('caseItem', JSON.stringify(caseItem));
    };

    // filter out the first task that is not completed
    useEffect(() => {
        const firstTaskTemp = caseItem?.tasks.find(task => task.status !== 'Completed');
        setFirstTask(firstTaskTemp);
    }, [caseItem]);

    // Format the createdAt date
    const formattedDate = format(new Date(caseItem?.createdAt), 'dd MMM yyyy');

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength - 3) + '...';
    }

    return (
        // <Link to={`/cases/details/${caseItem?._id}`} onClick={handleClick} style={{ textDecoration: 'none' }}>
        <Link to={`/cases/details/${caseItem?._id}`} style={{ textDecoration: 'none' }}>
            <Card elevation={5} sx={{
                marginBottom: 2,
                borderRadius: 3,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',  // Changes cursor to pointer on hover
                transition: 'transform 0.3s ease',  // Smooth transition for zoom effect
                '&:hover': {
                    transform: 'scale(1.05)',  // Slightly scales up the card on hover
                    boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.15)' // Optional: enhance shadow on hover for extra depth
                }
            }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mx: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography component="span" variant="h6">
                            {caseItem?.matterName}
                        </Typography>
                        <Typography variant="body1">
                            {caseItem?.clients[0].name}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography component="span" variant="body1" sx={{ width: '100px', textAlign: 'right', mr: 8 }}>
                            {formattedDate}
                        </Typography>
                        <Typography component="span" variant="body2" color="primary" sx={{ width: '150px', textAlign: 'right' }}>
                            {firstTask ? truncateText(firstTask.description, 25) : ''}
                        </Typography>
                        <ArrowForwardIosIcon sx={{ ml: 3 }} />
                    </Box>
                </CardContent>
            </Card>
        </Link>
    );
};

export default CaseCard;
