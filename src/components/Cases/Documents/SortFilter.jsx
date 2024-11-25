import React, { useState } from "react";
import { Popover, MenuItem, MenuList, Stack, Button, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';  // Using date-fns for this example
import DateRangeIcon from '@mui/icons-material/DateRange';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import muiStyles from "../../../styles/muiStyles";

const SortFilter = ({ selectedDate, setSelectedDate, filterByType, setFilterByType, sortBy, setSortBy }) => {
    const [anchorElDate, setAnchorElDate] = useState(null);
    const [anchorElType, setAnchorElType] = useState(null);
    const [anchorElSort, setAnchorElSort] = useState(null);

    const handleDateClick = (event) => setAnchorElDate(event.currentTarget);
    const handleDateClose = () => setAnchorElDate(null);

    const handleTypeClick = (event) => setAnchorElType(event.currentTarget);
    const handleTypeClose = () => setAnchorElType(null);

    const handleSortClick = (event) => setAnchorElSort(event.currentTarget);
    const handleSortClose = () => setAnchorElSort(null);

    return (
        <>
            <Stack direction="row" spacing={1}>
                <Button variant="contained" startIcon={<DateRangeIcon />} onClick={handleDateClick} sx={{ ...muiStyles.detailsButtonStyle, width: '12vh' }}>
                    Date
                </Button>
                <Button variant="contained" startIcon={<FilterListIcon />} onClick={handleTypeClick} sx={{ ...muiStyles.detailsButtonStyle, width: '12vh' }}>
                    Type
                </Button>
                <Button variant="contained" startIcon={<SortIcon />} onClick={handleSortClick} sx={{ ...muiStyles.detailsButtonStyle, width: '12vh' }}>
                    Sort
                </Button>
            </Stack>

            {/* Date Popover */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Popover open={Boolean(anchorElDate)} anchorEl={anchorElDate} onClose={handleDateClose}>
                    <Box p={2}>
                        <DatePicker
                            label="Choose a Date"
                            value={selectedDate}
                            onChange={(newValue) => {
                                setSelectedDate(newValue); // Update the selected date
                                handleDateClose();
                            }}
                        />
                    </Box>
                </Popover>
            </LocalizationProvider>

            {/* Type Popover */}
            <Popover open={Boolean(anchorElType)} anchorEl={anchorElType} onClose={handleTypeClose}>
                <MenuList>
                    <MenuItem onClick={() => { setFilterByType('all'); handleTypeClose(); }}>All</MenuItem>
                    <MenuItem onClick={() => { setFilterByType('folder'); handleTypeClose(); }}>Folder</MenuItem>
                    <MenuItem onClick={() => { setFilterByType('png'); handleTypeClose(); }}>PNG</MenuItem>
                    <MenuItem onClick={() => { setFilterByType('jpeg'); handleTypeClose(); }}>JPEG</MenuItem>
                    <MenuItem onClick={() => { setFilterByType('pdf'); handleTypeClose(); }}>PDF</MenuItem>
                    <MenuItem onClick={() => { setFilterByType('csv'); handleTypeClose(); }}>CSV</MenuItem>
                    <MenuItem onClick={() => { setFilterByType('word'); handleTypeClose(); }}>Word</MenuItem>
                </MenuList>
            </Popover>

            {/* Sort Popover */}
            <Popover open={Boolean(anchorElSort)} anchorEl={anchorElSort} onClose={handleSortClose}>
                <MenuList>
                    <MenuItem onClick={() => { setSortBy({ field: null, order: 'asc' }); handleSortClose(); }}>Default</MenuItem>
                    <MenuItem onClick={() => { setSortBy({ field: 'name', order: 'asc' }); handleSortClose(); }}>By Name (Asc)</MenuItem>
                    <MenuItem onClick={() => { setSortBy({ field: 'name', order: 'desc' }); handleSortClose(); }}>By Name (Desc)</MenuItem>
                    <MenuItem onClick={() => { setSortBy({ field: 'date', order: 'asc' }); handleSortClose(); }}>By Date (Asc)</MenuItem>
                    <MenuItem onClick={() => { setSortBy({ field: 'date', order: 'desc' }); handleSortClose(); }}>By Date (Desc)</MenuItem>
                    <MenuItem onClick={() => { setSortBy({ field: 'type', order: 'asc' }); handleSortClose(); }}>By Type (Asc)</MenuItem>
                    <MenuItem onClick={() => { setSortBy({ field: 'type', order: 'desc' }); handleSortClose(); }}>By Type (Desc)</MenuItem>
                </MenuList>
            </Popover>
        </>
    );
};

export default SortFilter;
