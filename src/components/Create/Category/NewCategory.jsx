import React from 'react';
import { useState } from 'react';
import { Container, Box, Typography, Button, TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { useCategoryContext } from '../../../context/CategoryContext';

const NewCategory = () => {

    const { category, setCategory, createCategory } = useCategoryContext();

    // Category Name Field
    const [categoryName, setCategoryName] = useState('');
    const handleCategoryNameChange = (event) => {
        setCategoryName(event.target.value);
    };

    // Case Details Fields
    const [detailFields, setDetailFields] = useState([{ id: 0, value: '', type: 'string' }]);

    const handleAddDetailField = () => {
        const newId = detailFields.length > 0 ? detailFields[detailFields.length - 1].id + 1 : 0;
        setDetailFields([...detailFields, { id: newId, value: '', type: 'string' }]);
    };

    const handleRemoveDetailField = (id) => {
        setDetailFields(detailFields.filter(field => field.id !== id));
    };

    const handleDetailChange = (id, event) => {
        const newFields = detailFields.map(field => {
            if (field.id === id) {
                return { ...field, value: event.target.value };
            }
            return field;
        });
        setDetailFields(newFields);
    };

    const handleDetailTypeChange = (id, newType) => {
        const newFields = detailFields.map(field => {
            if (field.id === id) {
                return { ...field, type: newType };
            }
            return field;
        });
        setDetailFields(newFields);
    };



    // Tasks Fields
    const [taskFields, setTaskFields] = useState([{ id: 0, value: '' }]);

    const handleAddTaskField = () => {
        const newId = taskFields.length > 0 ? taskFields[taskFields.length - 1].id + 1 : 0;
        setTaskFields([...taskFields, { id: newId, value: '' }]);
    };

    const handleRemoveTaskField = (id) => {
        setTaskFields(taskFields.filter(field => field.id !== id));
    };

    const handleTaskChange = (id, event) => {
        const newFields = taskFields.map(field => {
            if (field.id === id) {
                return { ...field, value: event.target.value };
            }
            return field;
        });
        setTaskFields(newFields);
    };

    // Create Category
    const handleSubmitDetails = (event) => {
        event.preventDefault();
        // Handle form submission with fields state
        console.log(detailFields)
        const transformedFields = transformDetailFields(detailFields);
        setCategory({ categoryName: categoryName, fields: transformedFields });
        console.log(transformedFields);
        setTabValue(1);
    };

    const handleSubmitTasks = (event) => {
        event.preventDefault();
        // Handle form submission with fields state

        const transformedTasks = transformTaskFields(taskFields);
        const newCategory = { ...category, tasks: transformedTasks };
        // To Database
        // console.log(newCategory);
        createCategory(newCategory);
    }

    const transformDetailFields = (fields) => {
        return fields.map(({ value, type }) => ({ name: value, type }));
    };
    const transformTaskFields = (fields) => {
        return fields.map(({ value }) => ({ description: value }));
    };

    // Tabs Handling
    const [tabValue, setTabValue] = useState(0);
    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="sm">
            <Box>

                <Typography variant="h4" gutterBottom>
                    New Category
                </Typography>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleChangeTab} aria-label="basic tabs example">
                        <Tab label="Case Details" {...a11yProps(0)} />
                        <Tab label="Tasks" {...a11yProps(1)} />
                    </Tabs>
                </Box>

                {/* Case Details */}
                <CustomTabPanel value={tabValue} index={0}>
                    <form onSubmit={handleSubmitDetails}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="categoryName"
                            label="Category Name"
                            name="categoryName"
                            autoFocus
                            onChange={handleCategoryNameChange}
                        />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Details Needed
                        </Typography>
                        {detailFields.map((field, index) => (
                            <Stack sx={{ mt: 1 }} key={field.id} spacing={2} direction="row">
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    value={field.value}
                                    onChange={(e) => handleDetailChange(field.id, e)}
                                    label={`Detail ${index + 1}`}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => handleRemoveDetailField(field.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <FormControl fullWidth>
                                    <Select
                                        variant="outlined"
                                        required
                                        fullWidth
                                        value={field.type}
                                        onChange={(e) => handleDetailTypeChange(field.id, e.target.value)}
                                    >
                                        <MenuItem value="string">String</MenuItem>
                                        <MenuItem value="number">Number</MenuItem>
                                        {/* Add more types here */}
                                    </Select>
                                </FormControl>
                            </Stack>
                        ))}
                        <Button
                            onClick={handleAddDetailField}
                            variant="outlined"
                            sx={{ mt: 3, mb: 2, width: '100%' }}
                        >
                            Add Detail
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 1, mb: 5 }}
                        >
                            Save and Continue to Tasks
                        </Button>
                    </form>
                </CustomTabPanel>

                {/* Tasks */}
                <CustomTabPanel value={tabValue} index={1}>
                    <form onSubmit={handleSubmitTasks}>
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Tasks Needed
                        </Typography>
                        {taskFields.map((field, index) => (
                            <TextField
                                key={field.id}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                value={field.value}
                                onChange={(e) => handleTaskChange(field.id, e)}
                                label={`Task ${index + 1}`}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => handleRemoveTaskField(field.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        ))}
                        <Button
                            onClick={handleAddTaskField}
                            variant="outlined"
                            sx={{ mt: 3, mb: 2, width: '100%' }}
                        >
                            Add Task
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 1, mb: 5 }}
                        >
                            Save and Create Category
                        </Button>
                    </form>
                </CustomTabPanel>

            </Box>
        </Container>
    );
};

// For Tabs
const CustomTabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default NewCategory;