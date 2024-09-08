import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Stack, Button, Autocomplete, InputAdornment, TextField, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import CaseCard from '../components/Cases/CaseCard';

import { useCaseContext } from '../context/CaseContext';
import { useCategoryContext } from '../context/CategoryContext';

const Cases = () => {
    const {
        caseItems,
        view,
        toMyCases,
        toAllCases,
        filteredCases,
        setFilteredCases,
        filterActiveCases,
        filterClosedCases,
        filteredCategory,
        setFilteredCategory,
        fetchCases,
        caseItemsLoaded
    } = useCaseContext();
    const { categories, fetchCategories } = useCategoryContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFilteredCases, setSearchFilteredCases] = useState([]);

    useEffect(() => {
        fetchCategories();
        toMyCases();
        console.log(caseItemsLoaded);
    }, []);

    useEffect(() => {
        filterCases(searchQuery, filteredCategory, filteredCases);
    }, [caseItems, searchQuery, filteredCategory, filteredCases]);

    const handleSearchChange = (event, newValue) => {
        setSearchQuery(newValue);
    };

    const filterCases = (query, category, status) => {
        let filtered = caseItems;

        // Apply category filter if the category is not 'All'
        if (category && category !== 'All') {
            filtered = filtered.filter(caseItem => caseItem.category._id === category);
        }

        if (status) {
            filtered = filtered.filter(caseItem => caseItem.status.toLowerCase() === status.toLowerCase());
        }

        // Apply search query filter
        if (query) {
            filtered = filtered.filter(caseItem =>
                caseItem.matterName.toLowerCase().includes(query.toLowerCase()) ||
                caseItem.clients.some(client => client.toLowerCase().includes(query.toLowerCase()))
            );
        }
        setSearchFilteredCases(filtered);
    };

    const filterCategory = (category) => {
        setFilteredCategory(category);
        filterCases(searchQuery, category, filteredCases); // Call combined filter logic with current search query
        console.log(filteredCases);
    };

    const handleFilterActiveCases = () => {
        setFilteredCases('active');
        filterCases(searchQuery, filteredCategory, 'active');
    };

    const handleFilterClosedCases = () => {
        setFilteredCases('closed');
        filterCases(searchQuery, filteredCategory, 'closed');
    };

    if (!caseItemsLoaded) {
        return <CircularProgress sx={{ml: '120vh', mt: '5vh'}}/>
    }else{
        console.log(caseItems);
    }

    return (
        <Container sx={{ p: 2 }}>
            <Typography variant='h2'>Cases</Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    {/* Side Navigation */}
                    <Grid item xs={2}>
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
                            <Button onClick={handleFilterActiveCases} variant={filteredCases === 'active' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                Active Cases
                            </Button>
                            <Button onClick={handleFilterClosedCases} variant={filteredCases === 'closed' ? "contained" : "outlined"} sx={{ my: 1, borderRadius: 3 }} >
                                Closed Cases
                            </Button>
                            <Typography variant='h5' sx={{ py: 1 }}>
                                Categories
                            </Typography>
                            <Button
                                onClick={() => filterCategory('All')}
                                variant={filteredCategory === 'All' ? "contained" : "outlined"}
                                sx={{ my: 1, mx: 1, borderRadius: 3 }}
                            >
                                All
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category._id}
                                    onClick={() => filterCategory(category._id)}
                                    variant={filteredCategory === category._id ? "contained" : "outlined"}
                                    sx={{ my: 1, mx: 1, borderRadius: 3 }}
                                >
                                    {category.categoryName}
                                </Button>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Main Content */}
                    <Grid item xs={8}>
                        <Container maxWidth="md">
                            <Autocomplete
                                freeSolo
                                id="case-search-bar"
                                disableClearable
                                options={caseItems.map((option) => option.matterName)}
                                value={searchQuery}
                                onInputChange={handleSearchChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Search Cases"
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
                        {/* <Container sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                            <Button variant='contained' sx={{ mx: 1 }}>
                                Date
                            </Button>
                            <Button variant='contained' sx={{ mx: 1 }}>
                                Sort
                            </Button>
                        </Container> */}
                        <Container sx={{ mt: 2 }}>
                            {searchFilteredCases.map((caseItem, index) => (
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
