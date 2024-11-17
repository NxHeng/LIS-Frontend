import React, { useState } from 'react';
import { Container, Button, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper, Stack } from '@mui/material';
import CollapsibleRow from './CollapsibleRow';

import { useCaseContext } from '../../context/CaseContext';

const CaseDetails = () => {

    const { toEditCaseDetails } = useCaseContext();
    const caseItem = JSON.parse(localStorage.getItem('caseItem'));

    // Separate fields by type
    const textNumberStakeholderFields = caseItem.fields.filter(field => field.type === 'text' || field.type === 'number' || field.type === 'stakeholder');
    const priceDateFields = caseItem.fields.filter(field => field.type === 'price' || field.type === 'date');

    return (
        <Container maxWidth={false} sx={{ width: '100%' }}>
            {
                caseItem.status === 'active' || caseItem.status === 'Active' ?
                    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                        <Button onClick={toEditCaseDetails} variant="contained" sx={{ mr: 1, borderRadius: 5, width: "10vh", mb: 3 }} >
                            Edit
                        </Button>
                        <Button variant="contained" sx={{ mr: 1, borderRadius: 5, width: "10vh", mb: 3 }} >
                            Print
                        </Button>
                    </Stack>
                    : null
            }

            {/* Table for Text and Number Fields */}
            {textNumberStakeholderFields.length > 0 ? (
                <TableContainer component={Paper} sx={{ mb: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" sx={{ width: '25%', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Title</TableCell>
                                <TableCell align="left" sx={{ width: '70%', fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell align="left" sx={{ width: '5%' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {textNumberStakeholderFields.map((field) => (
                                <CollapsibleRow key={field._id} field={field} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : null}

            {/* Table for Price and Date Fields */}
            {priceDateFields.length > 0 ? (
                <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align='left' sx={{ width: '25%', borderRight: '1px solid rgba(224, 224, 224, 1)' }}></TableCell>
                                <TableCell align='left' sx={{ width: '70%', fontWeight: 'bold' }}>Amount (RM) / Date</TableCell>
                                <TableCell align="left" sx={{ width: '5%' }}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {priceDateFields.map(field => (
                                <CollapsibleRow key={field._id} field={field} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : null}


        </Container>
    );
}

export default CaseDetails;