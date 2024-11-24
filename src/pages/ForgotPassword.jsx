import React, { useState } from "react";
import { TextField, Button, Container, Typography, Alert, Box, Card, CardContent } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/user/forgotPassword`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setError(""); 
                
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
                            Forgot Password
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Enter your email to receive a password reset link.
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                            <TextField
                                label="Email Address"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                            />
                            <Button type="submit" variant="contained" fullWidth>
                                Submit
                            </Button>
                        </Box>
                        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
                        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    </CardContent>
                </Card>
            </Container>
        </>
    );
};

export default ForgotPassword;
