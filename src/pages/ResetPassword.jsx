import React, { useState } from "react";
import { TextField, Button, Container, Typography, Alert, Card, CardContent, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(5); // Initialize countdown to 5 seconds


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/user/resetPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message); // Logs: 'Password has been reset successfully'
                setError(""); // Clear the error message
                // redirect to login page after 5 seconds and show the count down message
                // Start countdown and redirect
                const interval = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            navigate('/login'); // Redirect after countdown
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setError(data.message); // Logs the error message
                
            }
        } catch (error) {
            setError('An error occurred');
            return 'An error occurred'; // Return or display the error message
        }
    };
    return (
        <>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(/geometric-wallpaper-1.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(10px)',
                    zIndex: -1,
                    backdropFilter: 'blur(8px)'
                }}
            />

            <Container maxWidth="sm" sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                position: 'relative',
            }}>
                <Card sx={{ width: '100%', padding: 3, borderRadius: 5, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Reset Password
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                            <TextField
                                label="New Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Confirm Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                            />
                            <Button type="submit" variant="contained" fullWidth>
                                Reset Password
                            </Button>
                        </Box>
                        {message && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                {message}
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Redirecting to the login page in {countdown} seconds...
                                </Typography>
                            </Alert>
                        )}
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    </CardContent>
                </Card>
            </Container>
        </>
    );
};

export default ResetPassword;
