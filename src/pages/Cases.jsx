import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Box, Stack, Button, Autocomplete, InputAdornment, TextField, CircularProgress, Pagination, Card, CardContent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QuizIcon from '@mui/icons-material/Quiz';
import FilterAlt from '@mui/icons-material/FilterAlt';
import CategoryIcon from '@mui/icons-material/Category';

import CaseCard from '../components/Cases/CaseCard';
import Background from '../components/Background';
import muiStyles from '../styles/muiStyles';

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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchFilteredCases, setSearchFilteredCases] = useState([]);
    const userId = JSON.parse(localStorage.getItem('user'))._id;

    useEffect(() => {
        fetchCategories();
        toMyCases(userId);
        // console.log(caseItemsLoaded);
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
            filtered = filtered.filter(caseItem => caseItem?.category?._id === category);
        }

        if (status) {
            filtered = filtered.filter(caseItem => caseItem?.status.toLowerCase() === status.toLowerCase());
        }

        // Apply search query filter
        if (query) {
            filtered = filtered.filter(caseItem =>
                caseItem?.matterName.toLowerCase().includes(query.toLowerCase()) ||
                caseItem?.clients.some(client => client?.name.toLowerCase().includes(query.toLowerCase()))
            );
        }
        setSearchFilteredCases(filtered);
    };

    const filterCategory = (category) => {
        setFilteredCategory(category);
        filterCases(searchQuery, category, filteredCases); // Call combined filter logic with current search query
        // console.log(filteredCases);
    };

    const handleFilterActiveCases = () => {
        setFilteredCases('active');
        filterCases(searchQuery, filteredCategory, 'active');
    };

    const handleFilterClosedCases = () => {
        setFilteredCases('closed');
        filterCases(searchQuery, filteredCategory, 'closed');
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const filteredCasesForCurrentPage = searchFilteredCases.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    if (!caseItemsLoaded) {
        return <CircularProgress sx={{ ml: '120vh', mt: '5vh' }} />
    } else {
        // console.log(caseItems);
    }

    return (
        <>
            <Background />
            <Container maxWidth='lg' sx={{ p: 4 }} >
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        {/* Side Navigation */}
                        <Grid item xs={3}>
                            <Card sx={muiStyles.cardStyle}>
                                <CardContent>
                                    <Stack spacing={1}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            px: 2,
                                            pt: 1,
                                            pb: .5,
                                        }}>
                                            <Typography variant="h4" sx={{fontWeight: 'bold'}}>
                                                Cases
                                            </Typography>
                                        </Box>
                                        <Box sx={muiStyles.sideNavTitleStyle}>
                                            <FilterAlt fontSize="medium" sx={{ mr: 1 }} />
                                            <Typography variant="subtitle1">
                                                Filter
                                            </Typography>
                                        </Box>
                                        <Button onClick={() => toMyCases(userId)} variant={view === 'myCases' ? "contained" : "text"} sx={muiStyles.buttonStyle} >
                                            My Cases
                                        </Button>
                                        <Button onClick={toAllCases} variant={view === 'allCases' ? "contained" : "text"} sx={muiStyles.buttonStyle} >
                                            All Cases
                                        </Button>
                                        <Box sx={muiStyles.sideNavTitleStyle}>
                                            <QuizIcon fontSize="medium" sx={{ mr: 1 }} />
                                            <Typography variant="subtitle1">
                                                Status
                                            </Typography>
                                        </Box>

                                        <Button onClick={handleFilterActiveCases} variant={filteredCases === 'active' ? "contained" : "text"} sx={muiStyles.buttonStyle} >
                                            Active Cases
                                        </Button>
                                        <Button onClick={handleFilterClosedCases} variant={filteredCases === 'closed' ? "contained" : "text"} sx={muiStyles.buttonStyle} >
                                            Closed Cases
                                        </Button>
                                        <Box sx={muiStyles.sideNavTitleStyle}>
                                            <CategoryIcon fontSize="medium" sx={{ mr: 1 }} />
                                            <Typography variant="subtitle1">
                                                Categories
                                            </Typography>
                                        </Box>
                                        <Button
                                            onClick={() => filterCategory('All')}
                                            variant={filteredCategory === 'All' ? "contained" : "text"}
                                            sx={muiStyles.buttonStyle}
                                        >
                                            All
                                        </Button>
                                        {categories.map((category) => (
                                            <Button
                                                key={category._id}
                                                onClick={() => filterCategory(category._id)}
                                                variant={filteredCategory === category._id ? "contained" : "text"}
                                                sx={muiStyles.buttonStyle}
                                            >
                                                {category.categoryName}
                                            </Button>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Main Content */}
                        <Grid item xs={9}>
                            <Stack direction="column" spacing={2}>
                                <Card sx={{ ...muiStyles.cardStyle, p: 4 }}>
                                    <Container maxWidth="lg">
                                        <Autocomplete
                                            fullWidth
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
                                </Card>
                                <Card sx={muiStyles.cardStyle}>
                                    <CardContent>
                                        {/* <Container sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                            <Button variant='contained' sx={{ mx: 1 }}>
                                Date
                            </Button>
                            <Button variant='contained' sx={{ mx: 1 }}>
                                Sort
                            </Button>
                        </Container> */}
                                        <Container sx={{ mt: 2 }}>
                                            {filteredCasesForCurrentPage.length > 0 ? (
                                                filteredCasesForCurrentPage.map((caseItem, index) => (
                                                    <CaseCard key={index} caseItem={caseItem} />
                                                ))
                                            ) : (
                                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                                                    <Typography variant='h6' sx={{ alignItems: 'center' }}>No cases available</Typography>
                                                </Box>
                                            )}
                                        </Container>
                                    </CardContent>
                                </Card>
                                <Card sx={{
                                    ...muiStyles.cardStyle, p: 0,
                                    pb: 1,
                                }}>
                                    <CardContent>
                                        {/* Pagination */}
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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
                        </Grid>
                    </Grid>
                </Box>
            </Container >
        </>
    );
};

export default Cases;
