import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Stack, Button, Autocomplete, InputAdornment, TextField, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClientCaseCard from '../components/Cases/ClientCaseCard';
import Background from '../components/Background';

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
            <Container maxWidth="sm" sx={{ p: 2, mt: 5 }}>
                {/* <Typography variant='h3'>My Cases</Typography> */}
                <Card sx={{ width: '100%', padding: 3, borderRadius: 5, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>


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
                    </CardContent>
                </Card>
            </Container>

        </>

    );
};

export default MyCases;
