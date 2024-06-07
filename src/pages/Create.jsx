import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, Container, Typography, Stack } from '@mui/material';

import NewCase from '../components/Create/NewCase';
import NewCaseDetails from '../components/Create/NewCaseDetails';

import CategoryList from '../components/Create/Category/CategoryList';
import NewCategory from '../components/Create/Category/NewCategory';
import CategoryUpdate from '../components/Create/Category/CategoryUpdate';

import { useCreateContext } from '../context/CreateContext';

const Create = () => {
    const { view, toNewCase, toCategories } = useCreateContext();

    return (
        <Container sx={{ p: 2 }}>
            <Typography variant='h2'>Create</Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Stack>
                            {/* New Case */}
                            <Button onClick={toNewCase} variant={view === 'newCase' || view === 'newCaseDetails' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >New Case</Button>

                            <Typography variant='h5' sx={{ py: 1 }}>Manage</Typography>

                            {/* Categories */}
                            <Button onClick={toCategories} variant={view === 'categories' || view === 'newCategory' || view === 'categoryUpdate' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >Categories</Button>

                        </Stack>
                    </Grid>
                    <Grid item xs={8}>
                        {
                            view === 'newCase' ? (
                                <NewCase />
                            ) : view === 'newCaseDetails' ? (
                                <NewCaseDetails />
                            ) : view === 'categories' ? (
                                <CategoryList />
                            ) : view === 'newCategory' ? (
                                <NewCategory />
                            ) : view === 'categoryUpdate' ? (
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