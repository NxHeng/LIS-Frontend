import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const navigate = useNavigate();
    const { changePassword } = useAuthContext(); // Function to call API
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (event) => {
        setPasswords({
            ...passwords,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        const result = await changePassword({
            oldPassword: passwords.oldPassword,
            newPassword: passwords.newPassword
        });
        if (result.success) {
            alert('Password changed successfully!');
            //clear form
            setPasswords({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            // navigate to profile page
            navigate('/profile');
        } else {
            alert(result.message); // Display the error message from the backend
        }
    };


    return (
        <Container component="main" maxWidth="xs">
            <Typography component="h1" variant="h4" sx={{ mt: 10 }}>
                Change Password
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="oldPassword"
                    label="Old Password"
                    type="password"
                    value={passwords.oldPassword}
                    onChange={handleChange}
                    autoComplete="old-password"
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="newPassword"
                    label="New Password"
                    type="password"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Change Password
                </Button>
            </form>
        </Container>
    );
};

export default ChangePassword;
