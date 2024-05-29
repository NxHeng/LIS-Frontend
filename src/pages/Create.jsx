import React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, Container, Typography, Stack } from '@mui/material';

import NewCase from '../components/Create/NewCase';
import CategoryList from '../components/Create/Category/CategoryList';
import TemplateList from '../components/Create/Template/TemplateList';
import NewTemplate from '../components/Create/Template/NewTemplate';
import TemplateUpdate from '../components/Create/Template/TemplateUpdate';
import NewCategory from '../components/Create/Category/NewCategory';
import CategoryUpdate from '../components/Create/Category/CategoryUpdate';

import { useCreateContext } from '../context/CreateContext';

const Create = () => {
    const { view, toNewCase, toTemplates, toCategories } = useCreateContext();

    return (
        <Container sx={{ p: 2 }}>
            <Typography variant='h2'>Create</Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Stack>
                            {
                                view === 'newCase' ? (
                                    <Button variant="contained" sx={{ my: 1, borderRadius: 3 }} >New Case</Button>
                                ) : (
                                    <Button onClick={toNewCase} variant="outlined" sx={{ my: 1, borderRadius: 3 }} >New Case</Button>
                                )
                            }
                            <Typography variant='h5' sx={{ py: 1 }}>Manage</Typography>
                            {
                                view === 'templates' ? (
                                    <Button variant="contained" sx={{ my: 1, borderRadius: 3 }} >Templates</Button>
                                ) : (
                                    <Button onClick={toTemplates} variant="outlined" sx={{ my: 1, borderRadius: 3 }} >Templates</Button>
                                )
                            }
                            {
                                view === 'categories' || view === 'newCategory' || view === 'categoryUpdate' ? (
                                    <Button onClick={toCategories} variant="contained" sx={{ my: 1, borderRadius: 3 }} >Categories</Button>
                                ) : (
                                    <Button onClick={toCategories} variant="outlined" sx={{ my: 1, borderRadius: 3 }} >Categories</Button>
                                )
                            }
                        </Stack>
                    </Grid>
                    <Grid item xs={9}>
                        {view === 'newCase' ? (
                            <NewCase />
                        ) : view === 'templates' ? (
                            <TemplateList />
                        ) : view === 'categories' ? (
                            <CategoryList />
                        ) : view === 'newTemplate' ? (
                            <NewTemplate />
                        ) : view === 'templateUpdate' ? (
                            <TemplateUpdate />
                        ) : view === 'newCategory' ? (
                            <NewCategory />
                        ) : view === 'categoryUpdate' ? (
                            <CategoryUpdate />
                        ) : null}
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Create;