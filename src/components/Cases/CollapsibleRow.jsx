import React, { useState } from 'react';
import { Box, Collapse, IconButton, TableCell, TableRow, Typography, TextField, Stack } from '@mui/material';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import EditNoteIcon from '@mui/icons-material/EditNote';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { format } from 'date-fns';


const CollapsibleRow = ({ field }) => {
    const [open, setOpen] = useState(false);

    const formatDate = (date) => {
        return format(new Date(date), "yyyy-MM-dd");
    };

    return (
        <>
            <TableRow>
                <TableCell align="left" sx={{ width: '25%', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
                    {field.name}
                </TableCell>
                <TableCell align="left" sx={{ width: '70%' }}>
                    {field.type === 'date' ? (
                        formatDate(field.value)
                    ) : field.type === 'price' ? (
                        `RM ${field.value}`
                    ) : (
                        field.value
                    )}
                </TableCell>
                <TableCell align="left" sx={{ width: '5%' }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={{ pb: 0, pt: 0 }} colSpan={3}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 2 }}>
                            {field.type === 'stakeholder' ? (
                                <>
                                    <Typography sx={{ my: 2 }}>
                                        Additional Details
                                    </Typography>
                                    <Stack direction="row" spacing={5}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <LocalPhoneOutlinedIcon sx={{ mr: 1, my: 0.5 }} />
                                            <TextField
                                                value={field.tel}
                                                variant="standard"
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <EmailOutlinedIcon sx={{ mr: 1, my: 0.5 }} />
                                            <TextField
                                                value={field.email}
                                                variant="standard"
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <LocalPrintshopOutlinedIcon sx={{ mr: 1, my: 0.5 }} />
                                            <TextField
                                                value={field.fax}
                                                variant="standard"
                                                InputProps={{ readOnly: true }}
                                            />
                                        </Box>
                                    </Stack>
                                </>
                            ) : (
                                <>
                                    <Typography sx={{ my: 2 }} >
                                        Remarks
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <EditNoteIcon sx={{ mr: 1, my: 0.5 }} />
                                        <TextField
                                            value={field.remarks}
                                            variant="standard"
                                            InputProps={{ readOnly: true }}
                                            fullWidth
                                        />
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

        </>
    );
};

export default CollapsibleRow;