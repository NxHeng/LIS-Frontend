import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, CircularProgress, Paper } from '@mui/material';
import NotificationSettingsTable from '../../src/components/NotificationSettings/NotificationSettingsTable';
import Background from '../components/Background';
import muiStyles from '../styles/muiStyles';

const API_URL = import.meta.env.VITE_API_URL;

const NotificationSettings = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch notification settings from the backend
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                //fetch notification settings
                const response = await fetch(`${API_URL}/notificationSetting/fetchSettings`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error('Failed to fetch notification settings');
                }

                setSettings(data);
                setLoading(false);

            } catch (err) {
                setError('Failed to fetch notification settings');
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleUpdate = async (updatedSetting) => {
        try {

            //fetch
            const response = await fetch(`${API_URL}/notificationSetting/updateSetting`, {
                method: 'PATCH',
                body: JSON.stringify(updatedSetting),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update notification setting');
            }

            setSettings((prevSettings) => prevSettings.map((setting) => setting._id === updatedSetting._id ? updatedSetting : setting));
        } catch (err) {
            setError('Failed to update notification setting');
        }
    };

    return (
        <>
            <Background />
            <Container maxWidth="lg" sx={{ p: 2 }}>
                <Paper sx={{
                    ...muiStyles.paperStyle,
                    mb: 0,
                    px: 3,
                    pt: 2,
                    pb: 3,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h4' sx={{ px: 2, pt: 1.3, fontWeight: 'bold' }}>
                        Notification Settings
                    </Typography>
                </Paper>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <NotificationSettingsTable settings={settings} onUpdate={handleUpdate} />
                )}
            </Container>
        </>

    );
};

export default NotificationSettings;
