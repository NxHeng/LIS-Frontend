import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Stack, Button, Autocomplete, InputAdornment, TextField, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import CaseCard from '../components/Cases/CaseCard';

import { useCaseContext } from '../context/CaseContext';
import { useCategoryContext } from '../context/CategoryContext';

const MyCases = () => {
    const {
        caseItems,
        toMyCases,
        filteredCases,
        filteredCategory,
        caseItemsLoaded
    } = useCaseContext();
    const { categories, fetchCategories } = useCategoryContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFilteredCases, setSearchFilteredCases] = useState([]);
    const userId = JSON.parse(localStorage.getItem('user'))._id;

    useEffect(() => {
        fetchCategories();
        toMyCases(userId);
    }, []);

    useEffect(() => {
        filterCases(searchQuery, filteredCategory, filteredCases);
    }, [caseItems, searchQuery, filteredCategory, filteredCases]);

    const handleSearchChange = (event, newValue) => {
        setSearchQuery(newValue);
    };

    const filterCases = (query) => {
        let filtered = caseItems;

        // Apply search query filter
        if (query) {
            filtered = filtered.filter(caseItem =>
                caseItem.matterName.toLowerCase().includes(query.toLowerCase()) ||
                caseItem.clients.some(client => client.toLowerCase().includes(query.toLowerCase()))
            );
        }
        setSearchFilteredCases(filtered);
    };

    if (!caseItemsLoaded) {
        return <CircularProgress sx={{ml: '120vh', mt: '5vh'}}/>
    }else{
        // console.log(caseItems);
    }

    return (
        <Container sx={{ p: 2 }}>
            <Typography variant='h2'>My Cases</Typography>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>         

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

export default MyCases;
