import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Link } from 'react-router-dom';

import { useCaseContext } from '../../context/CaseContext';

const CaseCard = ({ caseItem }) => {

    console.log(caseItem)

    const handleClick = () => {
        localStorage.setItem('caseItem', JSON.stringify(caseItem));
    }

    return (
        <Link to={`/cases/details/${caseItem.id}`} onClick={handleClick} style={{ textDecoration: 'none' }} >
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
        </Link>
    );
};

export default CaseCard;