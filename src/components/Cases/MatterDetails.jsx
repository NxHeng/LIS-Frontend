import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, TableContainer, TableBody, TableHead, TableCell, Table, TableRow, Paper, Snackbar, Alert, Card, CardContent, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import muiStyles, { TransitionZoom, TransitionGrow, TransitionCollapse, TransitionFade } from '../../styles/muiStyles';

import { useCategoryContext } from '../../context/CategoryContext';
import { useCaseContext } from '../../context/CaseContext';
import { useNavigate } from 'react-router-dom';

const MatterDetails = ({ caseItem }) => {

    const { updateCaseAsClosedInDatabase, toEditMatterDetails, generateLink, isTemporary } = useCaseContext();
    const { fetchCategory, category } = useCategoryContext();
    const [qrCode, setQrCode] = useState(null);
    const [qrCodeVisible, setQrCodeVisible] = useState(false); // Toggle QR code visibility
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    // const caseItem = JSON.parse(localStorage.getItem('caseItem'));
    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : {};
    const navigate = useNavigate();

    const handleClose = () => {
        updateCaseAsClosedInDatabase(caseItem?._id, token);
        navigate('/cases');
    }

    const handleEdit = () => {
        toEditMatterDetails();
    }

    // Close Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return; // Prevent closing if clicked away
        }
        setSnackbarOpen(false);
    };

    const handleGenerateLink = async () => {
        const { url, qrCode } = await generateLink(caseItem?._id, token)
        console.log("URL ", url);
        console.log("QR Code ", qrCode);
        if (url) {
            setSnackbarMessage("Link copied to clipboard!");
            setSnackbarOpen(true);
        }
        if (qrCode) {
            console.log("QR Code: ", qrCode);
            console.log("QR Code visible: ", qrCodeVisible);
            setQrCode(qrCode);
            setQrCodeVisible(true);
        }
    }

    const handleCloseQRDialog = () => {
        setQrCode(null);
        setQrCodeVisible(false);
    }

    return (
        <>
            {/* Snackbar for copy to clipboard */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000} // Closes automatically after 4 seconds
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Positioning of the Snackbar
            >
                <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* Show QR Code in Dialog */}
            {
                qrCodeVisible && qrCode &&
                <Dialog
                    open={qrCodeVisible}
                    onClose={handleCloseQRDialog}
                    TransitionComponent={TransitionZoom}
                    PaperProps={{
                        ...muiStyles.DialogSyle  // Style applied to Paper inside the dialog
                    }}
                >
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'center' }}>QR Code</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Box component='img' sx={muiStyles.cardStyle} src={qrCode} alt="QR Code" />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseQRDialog} sx={muiStyles.detailsButtonStyle} color='error' variant='outlined'>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            }

            <Container >
                <Card sx={{ ...muiStyles.cardStyle, p: 2, mb: 2, display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{
                        px: 2,
                        pt: .5,
                        pb: .5,
                    }}>
                        <Typography variant="h6">
                            Matter Details
                        </Typography>
                    </Box>
                    {
                        caseItem?.status === 'active' || caseItem?.status === 'Active' && user.role !== 'client' && !isTemporary ?
                            // <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>

                            <Box>
                                <Button onClick={handleEdit} variant="contained" sx={{
                                    ...muiStyles.detailsButtonStyle,
                                    width: "10vh",
                                }} >
                                    Edit
                                </Button>
                                <Button onClick={handleClose} variant="contained" sx={muiStyles.detailsButtonStyle} >
                                    Mark As Closed
                                </Button>
                                <Button onClick={handleGenerateLink} variant="contained" sx={muiStyles.detailsButtonStyle} >
                                    Generate Link
                                </Button>
                            </Box>

                            : null
                    }
                </Card>
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
                                <TableCell align='left'>{caseItem?.matterName}</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell align='left'>File Reference</TableCell>
                                <TableCell align='left'>{caseItem?.fileReference}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='left'>Category</TableCell>
                                <TableCell align='left'>{caseItem?.category?.categoryName}</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell align='left'>Status</TableCell>
                                <TableCell align='left'>{caseItem?.status}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='left'>Solicitor In Charge</TableCell>
                                <TableCell align='left'>{caseItem?.solicitorInCharge?.username}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='left'>Clerk In Charge</TableCell>
                                <TableCell align='left'>{caseItem?.clerkInCharge?.username}</TableCell>
                            </TableRow>
                            {caseItem?.clients?.map((client, index) => (
                                <TableRow key={index}>
                                    <TableCell align='left'>Client {index + 1}</TableCell>
                                    <TableCell align='left'>{client.name} ({client.icNumber})</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container >
        </>
    );
}

export default MatterDetails;