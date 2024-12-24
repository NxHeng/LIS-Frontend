import React, { useEffect } from 'react';
import { useState } from 'react';
import { Container, Box, Typography, Button, TextField, InputAdornment, IconButton, CircularProgress, Stack, FormControl, Card, Tab, Tabs, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import muiStyles from '../../../styles/muiStyles';
import DeleteDialog from '../../DeleteDialog';

import { useCategoryContext } from '../../../context/CategoryContext';
import { useCreateContext } from '../../../context/CreateContext';
import { useFieldContext } from '../../../context/FieldContext';
import { useTaskFieldContext } from '../../../context/TaskFieldContext';

const CategoryUpdate = () => {

    const { fetchCategory, categoryLoaded, category, setCategory, selectedCategoryId, updateFields, updateTasks, deleteCategory, updateCategory } = useCategoryContext();
    const { toCategories } = useCreateContext();
    const { fetchFields, fields } = useFieldContext();
    const { fetchTaskFields, taskFields } = useTaskFieldContext();

    // Fetch category data when component mounts or selectedCategoryId changes
    useEffect(() => {
        if (selectedCategoryId) {
            fetchFields();
            fetchTaskFields();
            fetchCategory(selectedCategoryId);
        }
        console.log(category);
        console.log(selectedCategoryId);
    }, [selectedCategoryId]);

    // Initialize states
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    // const [detailFields, setDetailFields] = useState([]);
    // const [taskFields, setTaskFields] = useState([]);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (categoryLoaded && category) {
            setCategoryName(category.categoryName || '');
            // setDetailFields(category.fields ? category.fields.map((field, index) => field._id) : []);
            // setTaskFields(category.tasks ? category.tasks.map((task, index) => ({
            //     id: index,
            //     value: task.description,
            //     order: task.order || index
            // })) : []);
        }
    }, [categoryLoaded, category]);

    // Category Name Field
    const handleCategoryNameChange = (event) => {
        setCategoryName(event.target.value);
    };

    // Case Details Fields
    const handleDetailFieldSelection = (e, field) => {
        const isChecked = e.target.checked;
        setCategory(prevCategory => {
            const currentFields = prevCategory.fields || [];
            const fieldAlreadySelected = currentFields.some(f => f._id === field._id);

            if (isChecked && !fieldAlreadySelected) {
                return {
                    ...prevCategory,
                    fields: [...currentFields, { _id: field._id, name: field.name, type: field.type }]
                };
            } else if (!isChecked && fieldAlreadySelected) {
                return {
                    ...prevCategory,
                    fields: currentFields.filter(f => f._id !== field._id)
                };
            }

            return prevCategory; // Avoid unnecessary update if no change
        });
    };

    const handleTaskFieldSelection = (e, field) => {
        const isChecked = e.target.checked;
        setCategory(prevCategory => {
            const currentTasks = prevCategory.tasks || [];
            const fieldAlreadySelected = currentTasks.some(f => f._id === field._id);

            if (isChecked && !fieldAlreadySelected) {
                return {
                    ...prevCategory,
                    tasks: [...currentTasks, { _id: field._id, description: field.description }]
                };
            } else if (!isChecked && fieldAlreadySelected) {
                return {
                    ...prevCategory,
                    tasks: currentTasks.filter(f => f._id !== field._id)
                };
            }

            return prevCategory; // Avoid unnecessary update if no change
        });
    };


    // Tasks Fields
    // const handleAddTaskField = () => {
    //     const newId = taskFields.length > 0 ? taskFields[taskFields.length - 1].id + 1 : 0;
    //     const newOrder = newId;
    //     setTaskFields([...taskFields, { id: newId, value: '', order: newOrder }]);
    // };

    // const handleRemoveTaskField = (id) => {
    //     setTaskFields(taskFields.filter(field => field.id !== id));
    // };

    // const handleTaskChange = (id, event) => {
    //     const newFields = taskFields.map(field => {
    //         if (field.id === id) {
    //             return { ...field, value: event.target.value };
    //         }
    //         return field;
    //     });
    //     setTaskFields(newFields);
    // };

    const handleSaveDetail = (event) => {
        event.preventDefault();
        // Handle form submission with fields state
        // const transformedFields = transformDetailFields(detailFields);
        setCategory(prevCategory => ({
            ...prevCategory,
            categoryName: categoryName,
            // fields: transformedFields
        }));
        // To Database
        updateCategory(category, categoryName);
        toCategories();
    };

    const handleSaveTask = (event) => {
        event.preventDefault();
        // Handle form submission with fields state
        // const transformedTasks = transformTaskFields(taskFields);
        // setCategory(prevCategory => ({
        //     ...prevCategory,
        //     tasks: transformedTasks
        // }));
        // To Database
        updateCategory(category);
        toCategories();
    }

    // const transformDetailFields = (fields) => {
    //     return fields.map(({ value, type }) => ({ name: value, type }));
    // };
    // const transformTaskFields = (fields) => {
    //     return fields.map(({ value, order }) => ({ description: value, order }));
    // };

    const handleDeleteCategory = (category) => {
        deleteCategory(category);
        closeDeleteDialog();
        toCategories();
    }

    // Tabs Handling
    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };

    // Handle Drag End to update the order of selected fields
    const handleDragEnd = (result) => {
        const { destination, source } = result;

        // If dropped outside the list or no change in order
        if (!destination || destination.index === source.index) {
            return;
        }

        // Rearrange the selected field order based on the drag-and-drop result
        const updatedFields = Array.from(category.fields);  // Directly use category.fields
        const [removed] = updatedFields.splice(source.index, 1);  // Remove the item from the original position
        updatedFields.splice(destination.index, 0, removed);  // Insert the item in the new position

        // Update the category with the new order
        setCategory(prevCategory => ({
            ...prevCategory,
            fields: updatedFields,  // Update fields order in the category
        }));
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
        <>
            <DeleteDialog
                deleteDialogOpen={deleteDialogOpen}
                closeDeleteDialog={closeDeleteDialog}
                confirmDelete={handleDeleteCategory}
                isCategory={true}
                category={category}
            />
            <Box fullWidth sx={{ flexGrow: 1, mb: 2 }}>
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
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={8.5}>
                    <Stack spacing={2}>
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
                                        Select Details Needed
                                    </Typography>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Box>
                                            <Grid container spacing={1}>
                                                {fields.map((field) => (
                                                    <Grid item xs={12} sm={6} md={6} key={field._id}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    value={field._id}
                                                                    checked={category.fields ? category.fields.map(field => field._id).includes(field._id) : false}
                                                                    onChange={(e) => handleDetailFieldSelection(e, field)
                                                                    }
                                                                />
                                                            }
                                                            label={`${field.name}`}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </FormControl>

                                    <Box sx={{ display: 'flex', gap: 1, width: 1 }}>
                                        <Button onClick={handleDeleteClick} color='error' variant="outlined" sx={{ ...muiStyles.detailsButtonStyle, flexGrow: 1 }}>
                                            Delete
                                        </Button>
                                        <Button onClick={handleSaveDetail} color='success' variant="contained" sx={{ ...muiStyles.detailsButtonStyle, flexGrow: 1 }}>
                                            Save Details
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
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <Box>
                                            <Grid container spacing={1}>
                                                {taskFields.map((field) => (
                                                    <Grid item xs={12} sm={6} md={6} key={field._id}>
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox
                                                                    value={field._id}
                                                                    checked={category.tasks ? category.tasks.map(field => field._id).includes(field._id) : false}
                                                                    onChange={(e) => handleTaskFieldSelection(e, field)
                                                                    }
                                                                />
                                                            }
                                                            label={`${field.description}`}
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
                                        sx={{ ...muiStyles.detailsButtonStyle, mt: 1, mb: 2 }}
                                    >
                                        Save Tasks
                                    </Button>
                                </Box>
                            </CustomTabPanel>
                        </Card>
                    </Stack>
                </Grid>
                <Grid item xs={3.5}>
                    <Card sx={{
                        p: 4,
                        borderRadius: 3,
                        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Typography variant="h6" sx={{ ...muiStyles.sideNavTitleStyle, mb: 2 }} >
                                {tabValue === 0 ? 'Details Order' : 'Not Applicable'}
                            </Typography>

                        </Box>
                        {tabValue === 0 && (
                            <DragDropContext onDragEnd={handleDragEnd}>
                                <Droppable droppableId="selectedFields">
                                    {(provided) => (
                                        <Grid container spacing={1}
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >
                                            {category.fields && category.fields.length > 0 ? category.fields.map((field, index) => {
                                                return (
                                                    <Draggable key={field._id} draggableId={field._id} index={index}>
                                                        {(provided) => (
                                                            <Grid item xs={12} ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}>
                                                                <Box
                                                                    sx={{
                                                                        p: 2,
                                                                        border: '1px solid', borderColor: 'divider', borderRadius: 4,
                                                                        textAlign: 'start',
                                                                    }}
                                                                >
                                                                    <Typography>
                                                                        {index + 1}. {field.name || 'Unknown Field'}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        )}
                                                    </Draggable>
                                                );
                                            }) : (
                                                <Typography>No fields selected</Typography>
                                            )}
                                            {provided.placeholder}
                                        </Grid>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        )}
                    </Card>
                </Grid>
            </Grid >
        </>
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