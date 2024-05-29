import React from 'react';
import { useState } from 'react';
import { Container, Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


const NewCategory = () => {

    const [fields, setFields] = useState([{ id: 0, value: '' }]);

    const handleAddField = () => {
        const newId = fields.length > 0 ? fields[fields.length - 1].id + 1 : 0;
        setFields([...fields, { id: newId, value: '' }]);
    };

    const handleRemoveField = (id) => {
        setFields(fields.filter(field => field.id !== id));
    };

    const handleChange = (id, event) => {
        const newFields = fields.map(field => {
            if (field.id === id) {
                return { ...field, value: event.target.value };
            }
            return field;
        });
        setFields(newFields);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission with fields state
        console.log(fields);
    };

    return (
        <Container maxWidth="sm">
            <Box>
                <Typography variant="h4" gutterBottom>
                    New Category
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="categoryName"
                        label="Category Name"
                        name="categoryName"
                        autoFocus
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Details Needed
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Case Title
                    </Typography >
                    <Typography sx={{ mt: 2 }}>
                        Clients
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Lawyer Assigned
                    </Typography>
                    {fields.map((field, index) => (
                        <TextField
                            key={field.id}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            value={field.value}
                            onChange={(e) => handleChange(field.id, e)}
                            label={`Field ${index + 1}`}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleRemoveField(field.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    ))}
                    <Button
                        onClick={handleAddField}
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
                        Create Category
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default NewCategory;