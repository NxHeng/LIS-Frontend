import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const CaseCard = ({ caseItem }) => {
    const handleClick = () => {
        localStorage.setItem('caseItem', JSON.stringify(caseItem));
    };

    // Format the createdAt date
    const formattedDate = format(new Date(caseItem.createdAt), 'dd MMM yyyy');

    return (
        <Link to={`/cases/details/${caseItem.id}`} onClick={handleClick} style={{ textDecoration: 'none' }}>
            <Card elevation={5} sx={{ marginBottom: 2, borderRadius: 5 }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mx: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography component="span" variant="h6">
                            {caseItem.matterName}
                        </Typography>
                        <Typography variant="body1">
                            {caseItem.clients[0]}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography component="span" variant="body1" sx={{ width: '100px', textAlign: 'right', mr: 8 }}>
                            {formattedDate}
                        </Typography>
                        <Typography component="span" variant="body2" color="primary" sx={{ width: '100px', textAlign: 'right' }}>
                            {caseItem.tasks[0]?.description}
                        </Typography>
                        <ArrowForwardIosIcon sx={{ ml: 3 }} />
                    </Box>
                </CardContent>
            </Card>
        </Link>
    );
};

export default CaseCard;
