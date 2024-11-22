import React, { useEffect } from 'react';
import { Container, Typography, Box, Button, TableContainer, TableBody, TableHead, TableCell, Table, TableRow, Paper } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

import { useCategoryContext } from '../../context/CategoryContext';
import { useCaseContext } from '../../context/CaseContext';
import { useNavigate } from 'react-router-dom';

const MatterDetails = ({ caseItem }) => {

    const { updateCaseAsClosedInDatabase, toEditMatterDetails } = useCaseContext();
    const { fetchCategory, category } = useCategoryContext();
    // const caseItem = JSON.parse(localStorage.getItem('caseItem'));
    const user = jwtDecode(localStorage.getItem('token'));
    const navigate = useNavigate();

    // useEffect(() => {
    //     console.log(caseItem.status);
    //     fetchCategory(caseItem.category);
    //     console.log(caseItem);
    // }, []);

    const handleClose = () => {
        updateCaseAsClosedInDatabase(caseItem._id);
        navigate('/cases');
    }

    const handleEdit = () => {
        toEditMatterDetails();
    }

    return (
        <Container>
            {
                caseItem.status === 'active' || caseItem.status === 'Active' && user.role !== 'client' ? 
                <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
                    <Button onClick={handleEdit} variant="contained" sx={{ mr: 1, borderRadius: 5, width: "10vh" }} >
                        Edit
                    </Button>
                    <Button onClick={handleClose} variant="contained" sx={{ mx: 1, borderRadius: 5 }} >
                        Mark As Closed
                    </Button>
                    <Button variant="contained" sx={{ mx: 1, borderRadius: 5 }} >
                        Generate Link
                    </Button>
                </Box> : null
            }

            <TableContainer component={Paper} sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left' sx={{ width: '35%', fontWeight: 'bold' }}>Title</TableCell>
                            <TableCell align='left' sx={{ width: '65%', fontWeight: 'bold' }}>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow >
                            <TableCell align='left'>Matter Name</TableCell>
                            <TableCell align='left'>{caseItem.matterName}</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell align='left'>File Reference</TableCell>
                            <TableCell align='left'>{caseItem.fileReference}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align='left'>Category</TableCell>
                            <TableCell align='left'>{caseItem.category.categoryName}</TableCell>
                        </TableRow>
                        <TableRow >
                            <TableCell align='left'>Status</TableCell>
                            <TableCell align='left'>{caseItem.status}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align='left'>Solicitor In Charge</TableCell>
                            <TableCell align='left'>{caseItem.solicitorInCharge.username}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align='left'>Clerk In Charge</TableCell>
                            <TableCell align='left'>{caseItem.clerkInCharge.username}</TableCell>
                        </TableRow>
                        {caseItem.clients.map((client, index) => (
                            <TableRow key={index}>
                                <TableCell align='left'>Client {index + 1}</TableCell>
                                <TableCell align='left'>{client.name} ({client.icNumber})</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default MatterDetails;