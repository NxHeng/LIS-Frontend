import React, { useEffect } from 'react';
import { Button, Container, Typography, Stack, Box, Card, CardContent, Grid } from '@mui/material';
import muiStyles from '../styles/muiStyles';
import Background from '../components/Background';
import SettingsIcon from '@mui/icons-material/Settings';
import { jwtDecode } from 'jwt-decode';

import NewCase from '../components/Create/Case/NewCase';
import NewCaseDetails from '../components/Create/Case/NewCaseDetails';

import CategoryList from '../components/Create/Category/CategoryList';
import NewCategory from '../components/Create/Category/NewCategory';
import CategoryUpdate from '../components/Create/Category/CategoryUpdate';

import { useCreateContext } from '../context/CreateContext';

const Create = () => {
    const { view, toNewCase, toCategories } = useCreateContext();
    const user = jwtDecode(localStorage.getItem('token'));

    useEffect(() => {
        toNewCase();
    }, []);

    return (
        <>
            <Background />
            <Container sx={{ p: 4 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Card sx={{ ...muiStyles.cardStyle, height: 'auto' }}>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            px: 2,
                                            pt: 1,
                                            pb: .5,
                                        }}>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                                Create
                                            </Typography>
                                        </Box>
                                        {/* New Case */}
                                        {user.role === 'admin' &&
                                            <>
                                                <Button onClick={toNewCase} variant={view === 'newCase' || view === 'newCaseDetails' ? "contained" : "text"} sx={muiStyles.buttonStyle} >
                                                    New Case
                                                </Button>

                                                {/* Categories */}
                                                <Box sx={muiStyles.sideNavTitleStyle}>
                                                    <SettingsIcon fontSize="medium" sx={{ mr: 1 }} />
                                                    <Typography variant="subtitle1">
                                                        Manage
                                                    </Typography>
                                                </Box>
                                                <Button onClick={toCategories} variant={view === 'categories' || view === 'newCategory' || view === 'categoryUpdate' ? "contained" : "text"} sx={muiStyles.buttonStyle} >
                                                    Categories
                                                </Button>
                                            </>
                                        }
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={8}>
                            {
                                view === 'newCase' ? (
                                    <NewCase />
                                ) : view === 'newCaseDetails' ? (
                                    <NewCaseDetails />
                                ) : view === 'categories' && user.role === 'admin' ? (
                                    <CategoryList />
                                ) : view === 'newCategory' && user.role === 'admin' ? (
                                    <NewCategory />
                                ) : view === 'categoryUpdate' && user.role === 'admin' ? (
                                    <CategoryUpdate />
                                ) : null
                            }
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
};

export default Create;