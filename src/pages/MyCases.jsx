import React, { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Box, Stack, Button, Autocomplete, InputAdornment, TextField, CircularProgress, Pagination } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClientCaseCard from '../components/Cases/ClientCaseCard';
import Background from '../components/Background';
import muiStyles from '../styles/muiStyles';

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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

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

    const filteredCasesForCurrentPage = searchFilteredCases.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    if (!caseItemsLoaded) {
        return <CircularProgress sx={{ ml: '120vh', mt: '5vh' }} />
    } else {
        // console.log(caseItems);
    }

    return (
        <>
            <Background />
            <Container maxWidth="md" sx={{ p: 4 }}>

                <Stack direction="column" spacing={2}>
                    <Card sx={{ ...muiStyles.cardStyle, p: 2 }}>
                        <CardContent>
                            <Container maxWidth="lg">
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
                        </CardContent>
                    </Card>
                    {/* <Container sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                            <Button variant='contained' sx={{ mx: 1 }}>
                                Date
                            </Button>
                            <Button variant='contained' sx={{ mx: 1 }}>
                                Sort
                            </Button>
                        </Container> */}
                    <Card sx={muiStyles.cardStyle}>
                        <CardContent>
                            <Container sx={{ mt: 2 }}>
                                {filteredCasesForCurrentPage.map((caseItem, index) => (
                                    <ClientCaseCard key={index} caseItem={caseItem} />
                                ))}
                            </Container>
                        </CardContent>
                    </Card>
                    <Card sx={{
                        ...muiStyles.cardStyle, p: 0
                    }}>
                        <CardContent>
                            {/* Pagination */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                <Pagination
                                    count={Math.ceil(searchFilteredCases.length / itemsPerPage)}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Stack>
            </Container >

        </>

    );
};

export default MyCases;
