import React, { useState } from 'react';
import { Container, Button, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper, Stack, Card, CardContent, Box, Typography } from '@mui/material';
import CollapsibleRow from './CollapsibleRow';
import { jwtDecode } from 'jwt-decode';
import muiStyles from '../../styles/muiStyles';
import { exportPDF } from '../../utils/exportPDF';

import { useCaseContext } from '../../context/CaseContext';

const CaseDetails = ({ caseItem }) => {

    const { toEditCaseDetails, isTemporary } = useCaseContext();
    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : {};
    // const caseItem = JSON.parse(localStorage.getItem('caseItem'));

    // Separate fields by type
    const textNumberStakeholderFields = caseItem.fields.filter(field => field.type === 'text' || field.type === 'number' || field.type === 'stakeholder');
    const priceDateFields = caseItem.fields.filter(field => field.type === 'price' || field.type === 'date');

    return (
        <Container maxWidth="xl" sx={{ width: '100%' }}>
            <Card sx={{ ...muiStyles.cardStyle, p: 2, mb: 2, display: "flex", justifyContent: "space-between" }}>
                <Box sx={{
                    px: 2,
                    pt: .5,
                    pb: .5,
                }}>
                    <Typography variant="h6">
                        Case Details
                    </Typography>
                </Box>
                {
                    caseItem.status === 'active' || caseItem.status === 'Active' && user.role !== 'client' && !isTemporary ?

                        <Box>
                            <Button onClick={toEditCaseDetails} variant="contained" sx={{ ...muiStyles.detailsButtonStyle, width: '10vh' }} >
                                Edit
                            </Button>
                            {/* <Button variant="contained" sx={{ ...muiStyles.detailsButtonStyle, width: '10vh' }} >
                                Print
                            </Button> */}
                            <Button
                                onClick={() => exportPDF(caseItem)}
                                variant="contained"
                                color="primary"
                                sx={{ ...muiStyles.detailsButtonStyle, width: '19vh' }}
                            >
                                Export as PDF
                            </Button>
                        </Box>

                        : null
                }
            </Card>

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