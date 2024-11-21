import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, Container, Typography, Stack } from '@mui/material';
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
        <Container sx={{ p: 2 }}>
            <Typography variant='h2'>Create</Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Stack>
                            {/* New Case */}
                            {user.role === 'admin' &&
                                <>
                                    <Button onClick={toNewCase} variant={view === 'newCase' || view === 'newCaseDetails' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >New Case</Button>

                                    {/* Categories */}
                                    <Typography variant='h5' sx={{ py: 1 }}>Manage</Typography>
                                    <Button onClick={toCategories} variant={view === 'categories' || view === 'newCategory' || view === 'categoryUpdate' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >Categories</Button>
                                </>
                            }
                        </Stack>
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
    );
};

export default Create;