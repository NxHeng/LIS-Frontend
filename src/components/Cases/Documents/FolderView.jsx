import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    ListItem,
    ListItemIcon,
    IconButton,
    Box,
    Paper,
    Tooltip,
    Container,
    TextField,
    InputAdornment,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';

import FileItem from './FileItem';
import FolderItem from './FolderItem';
import NewItem from './NewItem';
import SortFilter from './SortFilter';
import ContextMenu from './ContextMenu';
import RenameDialog from './RenameDialog';
import MoveDialog from './MoveDialog';
import ItemDetail from './ItemDetail';

import { useDocumentContext } from '../../../context/DocumentContext';
import FilePreviewDialog from './FilePreviewDialog';

const FolderView = ({ folderData, setCurrentFolderId, searchList }) => {

    const { open, setOpen, selectedFile, setSelectedFile, filePreview, createFolder, uploadFile, folderStack, setFolderStack, deleteFile, deleteFolder, renameFile, renameFolder, setSelectedFolder, selectedFolder, selectedFolderForMove, setSelectedFolderForMove, downloadFile, moveFile, moveFolder, folderStackForMove, setFolderStackForMove } = useDocumentContext();

    // Combine folders and files into a single list
    const [anchorPosition, setAnchorPosition] = useState(null);
    const [moveDialogOpen, setMoveDialogOpen] = useState(false);
    const [renameDialogOpen, setRenameDialogOpen] = useState(false); // State for the rename dialog
    const [newName, setNewName] = useState('');

    const caseItem = localStorage.getItem('caseItem');
    const caseId = JSON.parse(caseItem)._id;

    const [selectedDate, setSelectedDate] = useState(null); // Date filter state
    const [filterByType, setFilterByType] = useState('all'); // Filter by type state
    const [sortBy, setSortBy] = useState({ field: null, order: 'asc' }); // Sort state
    const [searchQuery, setSearchQuery] = useState('');


    const combinedList = [...folderData.folders, ...folderData.files];
    const combinedSearchList = [...searchList.folders, ...searchList.files];
    const listToFilter = searchQuery ? combinedSearchList : combinedList;

    const mimeTypeMapping = {
        'application/pdf': 'PDF',
        'image/jpeg': 'JPEG',
        'image/png': 'PNG',
        'text/plain': 'Text File',
        'application/msword': 'Word',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
        'application/vnd.ms-excel': 'Excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
        'application/vnd.ms-powerpoint': 'PPT',
        'application/zip': 'ZIP',
        'application/x-rar-compressed': 'RAR',
        'application/x-7z-compressed': '7z',
        'application/vnd.rar': 'RAR',
        'application/vnd.7z': '7z',
        'application/octet-stream': 'Binary File',
        'application/json': 'JSON',
        'application/xml': 'XML',
        'text/html': 'HTML',
        'text/csv': 'CSV',
        'text/css': 'CSS',
        'text/javascript': 'JavaScript',
        'application/javascript': 'JavaScript',
        // Add more mappings as needed
        //csv file
    };

    const getFileType = (mimeType) => {
        return mimeTypeMapping[mimeType] || 'Unknown File Type';
    };

    const handleSearchChange = (event, newValue) => {
        setSearchQuery(newValue);
    };

    // Conditionally apply filtering and sorting based on search query

    // Filter the list by date, type, and search query
    const filteredList = listToFilter
        .filter(item => {
            if (selectedDate) {
                const itemDate = new Date(item.createdAt);
                return itemDate.toDateString() === new Date(selectedDate).toDateString();
            }
            return true;
        })
        .filter(item => {
            if (filterByType === 'all') return true;
            if (filterByType === 'folder' && item.folderName) return true;
            if (filterByType !== 'folder' && !item.folderName) {
                return getFileType(item.fileType).toLowerCase() === filterByType.toLowerCase();
            }
            return false;
        })
        .filter(item => {
            if (searchQuery) {
                const itemName = item.folderName || item.fileName;
                return itemName.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
        });

    // Sort the filtered list
    const sortedList = filteredList.sort((a, b) => {
        let compareA, compareB;
        switch (sortBy.field) {
            case 'name':
                compareA = a.folderName || a.fileName;
                compareB = b.folderName || b.fileName;
                break;
            case 'date':
                compareA = new Date(a.createdAt);
                compareB = new Date(b.createdAt);
                break;
            case 'type':
                compareA = getFileType(a.fileType);
                compareB = getFileType(b.fileType);
                break;
            default:
                return 0; // No sorting applied
        }

        if (compareA < compareB) return sortBy.order === 'asc' ? -1 : 1;
        if (compareA > compareB) return sortBy.order === 'asc' ? 1 : -1;
        return 0;
    });

    const handleFileClose = () => {
        setOpen(false);
        setSelectedFile(null);
    };

    const handleBackClick = () => {
        const newStack = [...folderStack];
        const previousFolderId = newStack.pop();
        setFolderStack(newStack);
        setCurrentFolderId(previousFolderId);
    };

    const handleRightClick = (event, item) => {
        event.preventDefault();
        setAnchorPosition({ mouseX: event.clientX - 2, mouseY: event.clientY - 4 });
        if (item.fileName) {
            setSelectedFile(item);
        } else {
            setSelectedFolder(item);
        }
    };

    const handleAnchorClose = () => {
        setAnchorPosition(null);
        // setSelectedFile(null);
    };

    const handleDelete = () => {
        if (selectedFile || selectedFolder) {
            if (selectedFile?.fileName) {
                // Perform folder delete operation
                deleteFile({ fileId: selectedFile._id, caseId });
                console.log('Deleting file:', selectedFile.fileName);
            } else {
                // Perform file delete operation
                deleteFolder({ folderId: selectedFolder._id, caseId });
                console.log('Deleting folder:', selectedFolder.folderName);
            }
        }
        handleAnchorClose(); // Close the context menu after performing the delete action
        setSelectedFile(null);
    };

    const handleRenameDialogClose = () => {
        setRenameDialogOpen(false);
        setNewName('');
    };

    // Handle changes in the new name text field
    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleRenameItem = async () => {
        if (selectedFile || selectedFolder && newName.trim()) {
            if (selectedFile?.fileName) {
                // Rename file
                await renameFile({ fileId: selectedFile._id, fileName: newName, caseId });
                console.log('Renamed file:', newName);
            } else {
                // Rename folder
                await renameFolder({ folderId: selectedFolder._id, folderName: newName, caseId });
                console.log('Renamed folder:', newName);
            }
        }
        handleRenameDialogClose(); // Close dialog after renaming
    };

    // Open the rename dialog when Rename option is selected
    const handleRename = () => {
        console.log(selectedFile, selectedFolder);
        if (selectedFile) {
            setNewName(selectedFile.fileName); // Set initial value to current name
            setRenameDialogOpen(true);
        } else {
            setNewName(selectedFolder.folderName); // Set initial value to current name
            setRenameDialogOpen(true);
        }
        handleAnchorClose();
    };

    const handleDownload = () => {
        if (selectedFile) {
            // Perform download operation
            console.log(selectedFile);
            downloadFile(selectedFile._id, selectedFile.fileName); // Pass fileId and fileName as separate arguments
            console.log('Downloading file:', selectedFile.fileName);
        }
        handleAnchorClose(); // Close the context menu after performing the download action
    };


    const handleMove = () => {
        setFolderStackForMove([]);
        setMoveDialogOpen(true);
        handleAnchorClose(); // Close the context menu after performing the move action
    };

    const handleMoveDialogClose = () => {
        setFolderStackForMove([]);
        setMoveDialogOpen(false);
        setSelectedFolder(null); // Reset the selected folder for move
        setSelectedFolderForMove(null); // Reset the selected folder for move
    };

    const handleMoveFile = async () => {
        if (selectedFile && caseId) {
            // Make API call to move the file
            await moveFile(selectedFile._id, selectedFolderForMove?._id, caseId);
            setMoveDialogOpen(false);
            setSelectedFile(null);
            setSelectedFolderForMove(null);
        } else if (selectedFolder && caseId) {
            // Make API call to move the folder
            await moveFolder(selectedFolder._id, selectedFolderForMove?._id, caseId);
            // console.log(selectedFolder._id, selectedFolderForMove?._id);
            setMoveDialogOpen(false);
            setSelectedFolder(null);
            setSelectedFolderForMove(null);
        }
    };

    return (
        <>
            {/* Search Bar */}
            <Container maxWidth="lg">
                <Autocomplete
                    freeSolo
                    id="search-bar"
                    disableClearable
                    options={combinedSearchList.map((item) => item.folderName || item.fileName)}
                    value={searchQuery}
                    onInputChange={handleSearchChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
            </Container>
            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 1 }}>
                <NewItem caseId={caseId} createFolder={createFolder} uploadFile={uploadFile} />
                <SortFilter
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    filterByType={filterByType}
                    setFilterByType={setFilterByType}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />
            </Box>

            {/* Main Content */}
            <TableContainer component={Paper} sx={{ maxHeight: '65vh', overflow: 'auto', mb: 5 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <ListItem>
                                    <ListItemIcon sx={{ pr: 0 }}>
                                        {/* <FolderIcon sx={{ visibility: 'hidden' }} fontSize="medium" /> */}
                                        {folderStack.length > 0 && (
                                            <IconButton
                                                sx={{
                                                    backgroundColor: 'white',
                                                    color: 'primary.main',
                                                    borderRadius: '50%',
                                                    width: '40px',
                                                    height: '40px',
                                                    border: '2px solid',
                                                    borderColor: 'primary.main',
                                                    '&:hover': {
                                                        backgroundColor: 'primary.dark',
                                                        borderColor: 'primary.dark',
                                                        color: 'white',
                                                    },
                                                }}
                                                onClick={handleBackClick}
                                            >
                                                <ArrowBackIcon />
                                            </IconButton>
                                        )}
                                    </ListItemIcon>
                                    <Typography variant='button'>Name</Typography>
                                </ListItem>
                            </TableCell>
                            <TableCell align='right'>
                                <Typography variant='button'>
                                    Date
                                </Typography>
                            </TableCell>
                            <TableCell align='right'>
                                <Typography variant='button'>
                                    Type
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <Typography variant="body1" color="textSecondary">
                                        No items to display
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedList.map((item) => (
                                <Tooltip key={item._id} title={item.folderName || item.fileName} arrow>
                                    <TableRow
                                        sx={{ '&:hover': { backgroundColor: '#f0f0f0', cursor: 'pointer' } }}
                                        onContextMenu={(event) => handleRightClick(event, item)}
                                    >
                                        <TableCell>
                                            {item.folderName ? (
                                                <FolderItem key={item._id} folder={item} setCurrentFolderId={setCurrentFolderId} />
                                            ) : (
                                                <FileItem key={item._id} file={item} />
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body1" color="textSecondary">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body1" color="textSecondary">
                                                {item.folderName ? 'Folder' : getFileType(item.fileType)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </Tooltip>
                            ))
                        )}

                    </TableBody>
                </Table>
            </TableContainer >

            <Box
                sx={{
                    width: '24%',
                    height: 'calc(100vh - 64px)', // Adjust this height according to the top app bar height
                    position: 'fixed',
                    right: 0,
                    top: '30vh', // Adjust this value according to the top app bar height
                }}
            >
                <ItemDetail
                    item={selectedFile ? selectedFile : selectedFolder}
                    handleRename={handleRename}
                    handleDownload={handleDownload}
                    handleDelete={handleDelete} 
                />
            </Box>

            {/* Right Click Anchor Pop up */}
            <ContextMenu
                anchorPosition={anchorPosition}
                handleAnchorClose={handleAnchorClose}
                handleMove={handleMove}
                handleDelete={handleDelete}
                handleRename={handleRename}
                handleDownload={handleDownload}
                selectedFile={selectedFile}
            />

            {/* Rename Pop up */}
            <RenameDialog
                renameDialogOpen={renameDialogOpen}
                handleRenameDialogClose={handleRenameDialogClose}
                handleRenameItem={handleRenameItem}
                selectedFile={selectedFile}
                newName={newName}
                handleNameChange={handleNameChange}
            />

            {/* Move Item Pop up */}
            <MoveDialog
                caseId={caseId}
                moveDialogOpen={moveDialogOpen}
                setMoveDialogOpen={setMoveDialogOpen}
                // folderData={folderData}
                selectedFolderForMove={selectedFolderForMove}
                setSelectedFolderForMove={setSelectedFolderForMove}
                handleMoveFile={handleMoveFile}
                selectedFile={selectedFile}
                selectedFolder={selectedFolder}
                handleMoveDialogClose={handleMoveDialogClose}
                folderStackForMove={folderStackForMove}
                setFolderStackForMove={setFolderStackForMove}
            />

            {/* File Preview Pop up */}
            <FilePreviewDialog
                open={open}
                selectedFile={selectedFile}
                filePreview={filePreview}
                handleFileClose={handleFileClose}
            />
        </>
    );
};

export default FolderView;
