import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const AnnouncementCard = ({ announcement, onClick }) => {

    const formatDateTime = (dateTime) => {
        const date = dateTime.substring(0, 10);
        const time = dateTime.substring(11, 19);

        const [year, month, day] = date.split('-');
        const reversedDate = `${day}-${month}-${year}`;

        return `${time} ${reversedDate}`;
    }

    return (
        <Card onClick={onClick} elevation={5} sx={{ marginBottom: 2, borderRadius: 5, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mx: 2 }}>
                <Typography component="span" variant="h6" sx={{ ml: "10vh" }}>
                    {announcement.title}
                </Typography>
                <Typography variant="body1" sx={{ mr: "10vh" }}>
                    {formatDateTime(announcement.date)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AnnouncementCard;
