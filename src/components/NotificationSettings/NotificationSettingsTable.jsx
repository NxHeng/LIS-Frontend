import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch, Paper, Button } from '@mui/material';

const NotificationSettingsTable = ({ settings, onUpdate }) => {
    const handleToggle = (setting, field) => {
        const updatedSetting = { ...setting, [field]: !setting[field] };
        onUpdate(updatedSetting);
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 3 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Notification Type</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Enabled</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="center">Send Email</TableCell>
                        {/* <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {settings.map((setting) => (
                        <TableRow key={setting._id}>
                            <TableCell>{setting.name}</TableCell>
                            <TableCell align="center">
                                <Switch
                                    checked={setting.isEnabled}
                                    onChange={() => handleToggle(setting, 'isEnabled')}
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Switch
                                    checked={setting.sendEmail}
                                    onChange={() => handleToggle(setting, 'sendEmail')}
                                />
                            </TableCell>
                            {/* <TableCell align="center">
                                <Button sx={muiStyles.detailsButtonStyle} variant="contained" color="primary" onClick={() => handleToggle(setting)}>
                                    Save
                                </Button>
                            </TableCell> */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default NotificationSettingsTable;
