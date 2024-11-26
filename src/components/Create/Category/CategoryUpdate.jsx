import React, { useEffect } from 'react';
import { useState } from 'react';
import { Container, Box, Typography, Button, TextField, InputAdornment, IconButton, CircularProgress, Stack, FormControl, Select, MenuItem, Card, Tab, Tabs } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import muiStyles from '../../../styles/muiStyles';

import { useCategoryContext } from '../../../context/CategoryContext';
import { useCreateContext } from '../../../context/CreateContext';

const CategoryUpdate = () => {

    const { fetchCategory, categoryLoaded, category, setCategory, selectedCategoryId, updateFields, updateTasks, deleteCategory } = useCategoryContext();
    const { toCategories } = useCreateContext();

    // Fetch category data when component mounts or selectedCategoryId changes
    useEffect(() => {
        if (selectedCategoryId) {
            fetchCategory(selectedCategoryId);
        }
        console.log(category);
        console.log(selectedCategoryId);
    }, [selectedCategoryId]);

    // Initialize states
    const [categoryName, setCategoryName] = useState('');
    const [detailFields, setDetailFields] = useState([]);
    const [taskFields, setTaskFields] = useState([]);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (categoryLoaded && category) {
            setCategoryName(category.categoryName || '');
            setDetailFields(category.fields ? category.fields.map((field, index) => ({
                id: index,
                value: field.name,
                type: field.type
            })) : []);
            setTaskFields(category.tasks ? category.tasks.map((task, index) => ({
                id: index,
                value: task.description,
                order: task.order || index
            })) : []);
        }
    }, [categoryLoaded, category]);

    // Category Name Field
    const handleCategoryNameChange = (event) => {
        setCategoryName(event.target.value);
    };

    // Case Details Fields
    const handleAddDetailField = () => {
        const newId = detailFields.length > 0 ? detailFields[detailFields.length - 1].id + 1 : 0;
        setDetailFields([...detailFields, { id: newId, value: '', type: 'text' }]);
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
    const handleAddTaskField = () => {
        const newId = taskFields.length > 0 ? taskFields[taskFields.length - 1].id + 1 : 0;
        const newOrder = newId;
        setTaskFields([...taskFields, { id: newId, value: '', order: newOrder }]);
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

    const handleSaveDetail = (event) => {
        event.preventDefault();
        // Handle form submission with fields state
        const transformedFields = transformDetailFields(detailFields);
        setCategory(prevCategory => ({
            ...prevCategory,
            categoryName: categoryName,
            fields: transformedFields
        }));
        // To Database
        updateFields(category, transformedFields, categoryName);
        // setTabValue(1);
        toCategories();
    };

    const handleSaveTask = (event) => {
        event.preventDefault();
        // Handle form submission with fields state
        const transformedTasks = transformTaskFields(taskFields);
        setCategory(prevCategory => ({
            ...prevCategory,
            tasks: transformedTasks
        }));
        // To Database
        updateTasks(category, transformedTasks);
        toCategories();
    }

    const transformDetailFields = (fields) => {
        return fields.map(({ value, type }) => ({ name: value, type }));
    };
    const transformTaskFields = (fields) => {
        return fields.map(({ value, order }) => ({ description: value, order }));
    };

    const handleDeleteCategory = (event) => {
        event.preventDefault();
        deleteCategory(category);
        toCategories();
    }

    // Tabs Handling
    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    if (!categoryLoaded) {
        console.log(categoryLoaded)
        return (
            <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Stack spacing={2}>
                <Card sx={{ ...muiStyles.cardStyle, p: 2 }}>
                    <Box sx={{
                        px: 2,
                        pt: .5,
                        pb: .5,
                    }}>
                        <Typography variant="h6">
                            Update Category
                        </Typography>
                    </Box>
                </Card>
                <Card sx={{ ...muiStyles.cardStyle, p: 4 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="basic tabs example">
                            <Tab sx={{ textTransform: 'capitalize' }} label="Case Details" {...a11yProps(0)} />
                            <Tab sx={{ textTransform: 'capitalize' }} label="Tasks" {...a11yProps(1)} />
                        </Tabs>
                    </Box>

                    {/* Case Details */}
                    <CustomTabPanel value={tabValue} index={0}>
                        {/* <form onSubmit={handleSubmit}> */}
                        <Box component='form'>
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
                                value={categoryName}
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
                                            <MenuItem value="text">Text</MenuItem>
                                            <MenuItem value="date">Date</MenuItem>
                                            <MenuItem value="price">Price</MenuItem>
                                            <MenuItem value="number">Number</MenuItem>
                                            <MenuItem value="stakeholder">Stakeholder</MenuItem>
                                            {/* Add more types here */}
                                        </Select>
                                    </FormControl>
                                </Stack>
                            ))}
                            <Button
                                onClick={handleAddDetailField}
                                variant="text"
                                sx={{ ...muiStyles.detailsButtonStyle, my: 2, width: '100%' }}
                            >
                                Add Detail
                            </Button>
                            <Box sx={{ display: 'flex', gap: 1, width: 1 }}>
                                <Button onClick={handleSaveDetail} color='success' variant="contained" sx={{ ...muiStyles.detailsButtonStyle, flexGrow: 1 }}>
                                    Save Details
                                </Button>
                                <Button onClick={handleDeleteCategory} color='error' variant="contained" sx={{ ...muiStyles.detailsButtonStyle, flexGrow: 1 }}>
                                    Delete
                                </Button>
                            </Box>
                        </Box>
                    </CustomTabPanel>

                    {/* Tasks */}
                    <CustomTabPanel value={tabValue} index={1}>
                        <Box component='form' onSubmit={handleSaveTask}>
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
                                variant="text"
                                sx={{ ...muiStyles.detailsButtonStyle, my: 2, width: '100%' }}
                            >
                                Add Task
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ ...muiStyles.detailsButtonStyle, mt: 1, mb: 2 }}
                            >
                                Save Tasks
                            </Button>
                        </Box>
                    </CustomTabPanel>
                </Card>
            </Stack>
        </Container >
    );
};

// For Tabs
const CustomTabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <Box
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
        </Box>
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

export default CategoryUpdate;