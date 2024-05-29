import React from 'react';
import { useState } from 'react';
import { Container, Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


const TemplateUpdate = () => {

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

    const handleSave = (event) => {
        event.preventDefault();
        // Handle form submission with fields state
        console.log(fields);
    };

    const handleDelete = (event) => {
        event.preventDefault();
        console.log(fields);
    }

    return (
        <Container maxWidth="sm">
            <Box>
                <Typography variant="h4" gutterBottom>
                    Update Template
                </Typography>
                {/* <form onSubmit={handleSubmit}> */}
                <form>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="templateName"
                        label="Template Name"
                        name="templateName"
                        autoFocus
                    />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Phases
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
                        Add Phase
                    </Button>

                    <Box sx={{ display: 'flex', gap: 1, width: 1 }}>
                        <Button onClick={handleSave} color='success' variant="contained" sx={{ flexGrow: 1 }}>
                            Save
                        </Button>
                        <Button onClick={handleDelete} color='error' variant="contained" sx={{ flexGrow: 1 }}>
                            Delete
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default TemplateUpdate;