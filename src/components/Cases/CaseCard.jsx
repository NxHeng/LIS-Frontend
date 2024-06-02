import React from 'react';
import { Card, CardContent, Typography, Container } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const CaseCard = ({ caseItem }) => {
    return (
        <Card elevation={5} sx={{ marginBottom: 2, borderRadius: 5 }}>
            <CardContent sx={{ display: "flex", justifyContent: "space-between", mx: 2 }}>
                    <Typography component="span" variant="h6">
                        {caseItem.title}
                    </Typography>
                    <Typography component="span" variant="h6">
                        {caseItem.date}
                    </Typography>
                    <Typography component="span" variant="h6" color="primary">
                        {caseItem.task}
                    </Typography>
                <ArrowForwardIosIcon sx={{ mx: 1, mt: 1 }} />
            </CardContent>
        </Card>
    );
};

export default CaseCard;