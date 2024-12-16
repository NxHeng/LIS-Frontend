import React, { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Button, TextField, FormControl, Stack, Tabs, Tab, Card, FormControlLabel, Checkbox, Grid,
} from '@mui/material';

import PropTypes from 'prop-types';
import muiStyles from '../../../styles/muiStyles';

import { useCategoryContext } from '../../../context/CategoryContext';
import { useCreateContext } from '../../../context/CreateContext';
import { useFieldContext } from '../../../context/FieldContext';
import { useTaskFieldContext } from '../../../context/TaskFieldContext';

const NewCategory = () => {

    const { category, setCategory, createCategory } = useCategoryContext();
    const { toCategories } = useCreateContext();
    const { fields, fetchFields } = useFieldContext();
    const { taskFields, fetchTaskFields } = useTaskFieldContext();
    const [categoryName, setCategoryName] = useState('');
    const [selectedDetailField, setSelectedDetailField] = useState('');
    const [selectedTaskField, setSelectedTaskField] = useState('');

    useEffect(() => {
        fetchFields();
        fetchTaskFields();
    }, []);

    // Category Name Field
    const handleCategoryNameChange = (event) => {
        setCategoryName(event.target.value);
    };

    // Case Details Fields
    const handleFieldChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedDetailField([...selectedDetailField, value]);
        } else {
            setSelectedDetailField(selectedDetailField.filter(field => field !== value));
        }
    };
    // Case Task Fields
    const handleTaskFieldChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedTaskField([...selectedTaskField, value]);
        } else {
            setSelectedTaskField(selectedTaskField.filter(field => field !== value));
        }
    }

    // Create Category (Save and continue to tasks)
    const handleSubmitDetails = (event) => {
        event.preventDefault();
        // Handle form submission with fields state
        // const transformedFields = selectedDetailField.map(fieldId => {
        //     const field = fields.find(f => f._id === fieldId);
        //     return { name: field.name, type: field.type };
        // });
        const transformedFields = selectedDetailField.map(fieldId => fieldId);
        console.log("transformed: ", transformedFields);
        setCategory({ categoryName: categoryName, fields: transformedFields });
        setTabValue(1);
    };

    // Create Category (Save and create category)
    const handleSubmitTasks = (event) => {
        event.preventDefault();
        // Transform selected task fields and assign ascending order
        // const transformedTasks = selectedTaskField.map((fieldId, index) => {
        //     const taskField = taskFields.find(f => f._id === fieldId);
        //     return {
        //         description: taskField.description,
        //         order: index + 1 
        //     };
        // });
        const transformedTasks = selectedTaskField.map(fieldId => fieldId)
        console.log("transformed: ", transformedTasks);
        const newCategory = {
            ...category,
            tasks: transformedTasks
        };
        // Save category to the database
        createCategory(newCategory);
        toCategories();
    };

    // Tabs Handling
    const [tabValue, setTabValue] = useState(0);
    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

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
                            New Category
                        </Typography>
                    </Box>
                </Card>
                <Card sx={{ ...muiStyles.cardStyle, p: 4 }}>
                    {/* Tabs */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleChangeTab} aria-label="basic tabs example">
                            <Tab sx={{ textTransform: 'capitalize' }} label="Case Details" {...a11yProps(0)} />
                            <Tab sx={{ textTransform: 'capitalize' }} label="Tasks" {...a11yProps(1)} />
                        </Tabs>
                    </Box>

                    {/* Case Details */}
                    <CustomTabPanel value={tabValue} index={0}>
                        <Box component="form" onSubmit={handleSubmitDetails}>
                            <Typography variant="h6" sx={{ mt: 2 }}>Category Name</Typography>
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

                            <Typography variant="h6" sx={{ mt: 2 }}>Select Details Needed</Typography>
                            {/* Display all available fields as checkboxes in a structured layout */}
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <Box>
                                    <Grid container spacing={1}>
                                        {fields.map((field) => (
                                            <Grid item xs={12} sm={6} md={4} key={field._id}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            value={field._id}
                                                            checked={selectedDetailField.includes(field._id)}
                                                            onChange={handleFieldChange}
                                                        />
                                                    }
                                                    label={`${field.name}`}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </FormControl>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ ...muiStyles.detailsButtonStyle, mt: 1, mb: 5 }}
                            >
                                Save and Continue to Tasks
                            </Button>
                        </Box>
                    </CustomTabPanel>


                    {/* Tasks */}
                    <CustomTabPanel value={tabValue} index={1}>
                        <Box component='form' onSubmit={handleSubmitTasks}>
                            <Typography variant="h6" sx={{ mt: 2 }}>
                                Tasks Needed
                            </Typography>
                            <Grid container spacing={1}>
                                {taskFields.map((field) => (
                                    <Grid item xs={12} sm={6} md={6} key={field._id}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value={field._id}
                                                    checked={selectedTaskField.includes(field._id)}
                                                    onChange={handleTaskFieldChange}
                                                />
                                            }
                                            label={`${field.description}`}
                                        />
                                    </Grid>
                                ))}
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ ...muiStyles.detailsButtonStyle, mt: 1, mb: 5 }}
                            >
                                Save and Create Category
                            </Button>
                        </Box>
                    </CustomTabPanel>
                </Card>
            </Stack>
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