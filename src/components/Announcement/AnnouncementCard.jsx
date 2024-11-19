import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { format } from 'date-fns';

const AnnouncementCard = ({ announcement, onClick }) => {

    // const formatDate = (dateTime) => {
    //     const date = dateTime.substring(0, 10);
    //     const time = dateTime.substring(11, 16);

    //     const [year, month, day] = date.split('-');
    //     const reversedDate = `${day}/${month}/${year}`;

    //     return `${reversedDate} ${time}`;
    // }

    const formatDate = (date) => {
        return format(new Date(date), "yyyy-MM-dd");
    };

    return (
        <Card onClick={onClick} elevation={5} sx={{
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
                <Typography component="span" variant="h6" sx={{ ml: "10vh" }}>
                    {announcement.title}
                </Typography>
                <Typography variant="body1" sx={{ mr: "10vh" }}>
                    {formatDate(announcement.date)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default AnnouncementCard;
