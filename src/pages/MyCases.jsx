import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Stack, Button, Autocomplete, InputAdornment, TextField, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import ClientCaseCard from '../components/Cases/ClientCaseCard';

import { useCaseContext } from '../context/CaseContext';
import { useCategoryContext } from '../context/CategoryContext';

const MyCases = () => {
    const {
        caseItems,
        filteredCases,
        filteredCategory,
        caseItemsLoaded,
        fetchCasesByClient
    } = useCaseContext();
    const { categories, fetchCategories } = useCategoryContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchFilteredCases, setSearchFilteredCases] = useState([]);
    const userIc = JSON.parse(localStorage.getItem('user')).ic;

    useEffect(() => {
        fetchCategories();
        fetchCasesByClient(userIc);
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
        return <CircularProgress sx={{ ml: '120vh', mt: '5vh' }} />
    } else {
        // console.log(caseItems);
    }

    return (
        <Container maxWidth="sm" sx={{ p: 2, mt: 5 }}>
            {/* <Typography variant='h3'>My Cases</Typography> */}
            <Container maxWidth="sm">
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
                    <ClientCaseCard key={index} caseItem={caseItem} />
                ))}
            </Container>
        </Container>
    );
};

export default MyCases;
