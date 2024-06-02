import React from 'react';
import { Container, Typography, Grid, Box, Stack, Button, Autocomplete, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import CaseCard from '../components/Cases/CaseCard';

import { useCaseContext } from '../context/CaseContext';

const Cases = () => {

    // Dummy data
    const cases = [{ title: "case 1", date: "6-6-2024", task: "Task 1" }, { title: "case 2", date: "4-6-2024", task: "Task 2" }, { title: "case 3", date: "3-6-2024", task: "Task 3" }];

    const {
        view,
        toMyCases,
        toAllCases,
        filteredCases,
        filterActiveCases,
        filterClosedCases,
        filteredCategory,
        filterCategory
    } = useCaseContext();

    const categories = ['All', 'Housing Project', 'Completed Property', 'Options', 'Loan']

    return (
        <Container sx={{ p: 2 }}>
            <Typography variant='h2'>Cases</Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {/* Side Navigation */}
                    <Grid item xs={3}>
                        <Stack>

                            <Button onClick={toMyCases} variant={view === 'myCases' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                My Cases
                            </Button>

                            <Button onClick={toAllCases} variant={view === 'allCases' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                All Cases
                            </Button>

                            <Typography variant='h5' sx={{ py: 1 }}>
                                Status
                            </Typography>

                            <Button onClick={filterActiveCases} variant={filteredCases === 'active' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                Active Cases
                            </Button>

                            <Button onClick={filterClosedCases} variant={filteredCases === 'closed' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                Closed Cases
                            </Button>

                            <Typography variant='h5' sx={{ py: 1 }}>
                                Categories
                            </Typography>
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    onClick={() => filterCategory(category)}
                                    variant={filteredCategory === category ? "contained" : "outlined"}
                                    sx={{ my: 1, mx: 1, borderRadius: 3 }}
                                >
                                    {category}
                                </Button>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={9}>
                        <Container maxWidth="md">
                            <Autocomplete
                                freeSolo
                                id="free-solo-2-demo"
                                disableClearable
                                options={cases.map((option) => option.title)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search input"
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Container>
                        <Container sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                            <Button variant='contained' sx={{ mx: 1 }}>
                                Date
                            </Button>
                            <Button variant='contained' sx={{ mx: 1 }}>
                                Sort
                            </Button>
                        </Container>

                        <Container sx={{ mt: 2 }}>
                            {cases.map((caseItem, index) => (
                                <CaseCard key={index} caseItem={caseItem} />
                            ))}
                        </Container>

                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Cases;