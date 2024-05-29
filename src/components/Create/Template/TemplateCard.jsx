import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

import { useCreateContext } from '../../../context/CreateContext';

const TemplateCard = ({ template }) => {
    const { toTemplateUpdate } = useCreateContext();
    return (
        <Card onClick={toTemplateUpdate} elevation={3} sx={{ marginBottom: 2, borderRadius: 5 }}>
            <CardContent>
                <Typography variant="h6">
                    {template}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default TemplateCard;