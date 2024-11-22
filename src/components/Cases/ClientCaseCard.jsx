import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ClientCaseCard = ({ caseItem }) => {

    const handleClick = () => {
        localStorage.setItem('caseItem', JSON.stringify(caseItem));
    };
    
    // Format the createdAt date
    const formattedDate = format(new Date(caseItem.createdAt), 'dd MMM yyyy');

    return (
        <Link to={`/client/mycases/details/${caseItem._id}`} onClick={handleClick} style={{ textDecoration: 'none' }}>
            <Card elevation={5} sx={{
                marginBottom: 2,
                borderRadius: 5,
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
                            {caseItem.matterName}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography component="span" variant="body1" sx={{ width: '100px', textAlign: 'right', mr: 8 }}>
                            {formattedDate}
                        </Typography>
                        <ArrowForwardIosIcon sx={{ ml: 3 }} />
                    </Box>
                </CardContent>
            </Card>
        </Link>
    );
};

export default ClientCaseCard;
