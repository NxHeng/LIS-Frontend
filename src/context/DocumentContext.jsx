import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './AuthContext';

const DocumentContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const DocumentContextProvider = ({ children }) => {

    const { user } = useAuthContext();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (!user) {
            <Navigate to="/login" />
        }
        else {
            setUserId(JSON.parse(localStorage.getItem('user'))._id);
        }
    }, [user]);

    const [currentFolderId, setCurrentFolderId] = useState(null); // Root folder by default
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedFolderForMove, setSelectedFolderForMove] = useState(null);
    const [folderDataForMove, setFolderDataForMove] = useState({ folders: [] });
    const [folderStack, setFolderStack] = useState([]);
    const [folderStackForMove, setFolderStackForMove] = useState([]); // Stack to keep track of folders (in move dialog)
    const [folderData, setFolderData] = useState({ files: [], folders: [] });
    const [searchList, setSearchList] = useState({ files: [], folders: [] });

    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const [openContextMenu, setOpenContextMenu] = useState(false);
    const [contextMenuEvent, setContextMenuEvent] = useState(null);
    const [anchorPosition, setAnchorPosition] = useState(null);
    const [moveDialogOpen, setMoveDialogOpen] = useState(false);
    const [renameDialogOpen, setRenameDialogOpen] = useState(false); // State for the rename dialog
    const [newName, setNewName] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const fetchContents = async (caseId) => {
        try {
            const params = new URLSearchParams({
                caseId: caseId,
                folderId: currentFolderId || ''
            });
            const response = await fetch(`${API_URL}/document/listContents?${params.toString()}`);
            const data = await response.json();
            setFolderData(data);
            // console.log('Fetched folder contents:', data);
        } catch (err) {
            console.error('Error fetching folder contents:', err);
        }
    };

    const fetchFolders = async (caseId) => {
        try {
            const params = new URLSearchParams({
                caseId: caseId,
                folderId: selectedFolderForMove?._id || ''
            });
            const response = await fetch(`${API_URL}/document/listFolders?${params.toString()}`);
            const data = await response.json();
            setFolderDataForMove(data);
            console.log('Fetched folder only contents:', data);
        } catch (err) {
            console.error('Error fetching folder contents:', err);
        }
    };

    const fetchEverything = async (caseId) => {
        try {
            const params = new URLSearchParams({
                caseId: caseId,
            });
            const response = await fetch(`${API_URL}/document/listEverything?${params.toString()}`);
            const data = await response.json();
            setSearchList(data);
            console.log('Fetched everything:', data);
        } catch (err) {
            console.error('Error fetching everything:', err);
        }
    };

    const fetchPreview = async (fileId, fileType) => {
        try {
            // Build the query string with the fileId
            const params = new URLSearchParams({
                fileId: fileId,
            });

            // Make the request to the backend to fetch the file preview
            const response = await fetch(`${API_URL}/document/previewFile?${params.toString()}`);

            // Check if the response is successful
            if (!response.ok) {
                throw new Error('Failed to fetch file preview');
            }

            // Handle different file types
            if (['application/pdf', 'image/jpeg', 'image/png'].includes(fileType)) {
                // For binary files, read the response as a blob
                const blob = await response.blob();

                // Create a URL for the blob to be used in the UI
                const fileUrl = URL.createObjectURL(blob);
                console.log('Fetched file preview:', fileUrl);
                return fileUrl;

            } else if (fileType === 'text/plain') {
                // For text files, read the response as text
                const textContent = await response.text();
                console.log('Fetched text file content:', textContent);
                return textContent; // Return raw text for direct rendering

            } else if (fileType === 'text/csv') {
                // For CSV files, read the response as text for preview
                const csvContent = await response.text();
                console.log('Fetched CSV file content:', csvContent);
                return csvContent;

            } else if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                // For Word documents, use external viewers or fetch blob
                const blob = await response.blob();
                const fileUrl = URL.createObjectURL(blob);
                console.log('Fetched Word file preview:', fileUrl);
                return fileUrl;

            } else {
                // Default handling for unsupported file types
                throw new Error(`Unsupported file type: ${fileType}`);
            }

        } catch (err) {
            // Log the error to the console if something goes wrong
            console.error('Error fetching file preview:', err);
            return null;
        }
    };


    const createFolder = async ({ caseId, folderName }) => {
        try {
            console.log(caseId, folderName, currentFolderId);
            const response = await fetch(`${API_URL}/document/createFolder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    caseId,
                    parentFolderId: currentFolderId || '',
                    folderName
                })
            });

            const data = await response.json();
            console.log('Folder created:', data);

            // Fetch the updated folder contents after creating the folder
            fetchContents(caseId);
            fetchFolders(caseId);
        } catch (err) {
            console.error('Error creating folder:', err);
        }
    };

    const uploadFile = async ({ caseId, file }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('caseId', caseId); // Add caseId to the form data if required by your API
        formData.append('folderId', currentFolderId || ''); // Add parentFolderId to the form data if required by your API
        formData.append('uploadedBy', userId || '');

        try {
            const response = await fetch(`${API_URL}/document/upload`, {
                method: 'POST',
                body: formData, // Use FormData for file upload
            });

            // Check if the response is JSON
            const contentType = response.headers.get('content-type');
            let result;
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                // If not JSON, treat it as text (for debugging plain text responses)
                result = await response.text();
            }

            if (!response.ok) {
                throw new Error(`Error uploading file: ${response.statusText}`);
            }

            console.log('File uploaded successfully', result);
            // Fetch the updated folder contents after creating the folder
            fetchContents(caseId);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const deleteFile = async ({ fileId, caseId }) => {
        try {
            console.log(fileId);

            const response = await fetch(`${API_URL}/document/deleteFile`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileId })
            });

            const data = await response.json();
            console.log('File deleted:', data);

            // Fetch the updated folder contents after deleting the file
            fetchContents(caseId);
        } catch (err) {
            console.error('Error deleting file:', err);
        }
    };

    const deleteFolder = async ({ folderId, caseId }) => {
        try {
            const response = await fetch(`${API_URL}/document/deleteFolder`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ folderId, caseId })
            });

            const data = await response.json();
            console.log('Folder deleted:', data);

            // Fetch the updated folder contents after deleting the folder
            fetchContents(caseId);
        } catch (err) {
            console.error('Error deleting folder:', err);
        }
    }

    const renameFile = async ({ fileId, fileName, caseId }) => {
        try {
            const response = await fetch(`${API_URL}/document/renameFile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fileId, fileName })
            });

            const data = await response.json();
            console.log('File renamed:', data);

            // Fetch the updated folder contents after renaming the file
            fetchContents(caseId);
        } catch (err) {
            console.error('Error renaming file:', err);
        }
    };

    const renameFolder = async ({ folderId, folderName, caseId }) => {
        try {
            const response = await fetch(`${API_URL}/document/renameFolder`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ folderId, folderName })
            });

            const data = await response.json();
            console.log('Folder renamed:', data);

            // Fetch the updated folder contents after renaming the folder
            fetchContents(caseId);
        } catch (err) {
            console.error('Error renaming folder:', err);
        }
    };

    // const downloadFile = async (fileId, fileName) => {
    //     try {
    //         const params = new URLSearchParams({ fileId });
    //         const response = await fetch(`${API_URL}/document/downloadFile?${params.toString()}`);
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const blob = await response.blob();
    //         const url = URL.createObjectURL(blob);
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = fileName || 'download'; // Use the provided fileName or default to 'download'
    //         document.body.appendChild(a); // Append the anchor to the body
    //         a.click();
    //         document.body.removeChild(a); // Remove the anchor from the body
    //         URL.revokeObjectURL(url); // Revoke the object URL

    //         console.log('File downloaded:', url);
    //     } catch (err) {
    //         console.error('Error downloading file:', err);
    //     }
    // };

    const downloadFile = async (fileId, fileName) => {
        try {
            // Make the API request to your backend
            const response = await fetch(`${API_URL}/document/downloadFile?fileId=${fileId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // Check if the response is OK (status 200)
            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            // Create a Blob from the response
            const blob = await response.blob();

            // Create a link to trigger the download
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;

            console.log(response.headers.get('Content-Disposition'));
            // The filename is already provided in the response headers from the backend
            const fileName = response.headers.get('Content-Disposition').split('filename=')[1].replace(/"/g, '');

            link.download = fileName; // Use the filename from the header

            // Programmatically click the link to trigger the download
            link.click();

            // Cleanup the URL object
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };



    const moveFile = async (fileId, newFolderId, caseId) => {
        try {
            const response = await fetch(`${API_URL}/document/moveFile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileId, newFolderId }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('File moved successfully:', data);
            } else {
                console.error('Error moving file:', data.message);
            }
            fetchContents(caseId);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const moveFolder = async (folderId, newParentFolderId, caseId) => {
        try {
            const response = await fetch(`${API_URL}/document/moveFolder`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folderId, newParentFolderId }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Folder moved successfully:', data);
            } else {
                console.error('Error moving folder:', data.message);
            }
            fetchContents(caseId);
        } catch (err) {
            console.error('Error:', err);
        }
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
        // handleAnchorClose();
    };

    const handleDownload = () => {
        if (selectedFile) {
            // Perform download operation
            console.log(selectedFile);
            downloadFile(selectedFile._id, selectedFile.fileName); // Pass fileId and fileName as separate arguments
            // console.log('Downloading file:', selectedFile.fileURI);
        }
        handleAnchorClose(); // Close the context menu after performing the download action
    };

    const handleAnchorClose = () => {
        setAnchorPosition(null);
        setSelectedFile(null);
        setSelectedFolder(null);
        setOpenContextMenu(false);
        setContextMenuEvent(null);
    };

    const handleDelete = (caseId) => {
        if (selectedFile || selectedFolder) {
            if (selectedFile?.fileName) {
                // Perform folder delete operation
                deleteFile({ fileId: selectedFile._id, caseId });
                console.log('Deleting file:', selectedFile.fileName);
                setSelectedFile(null);
            } else {
                // Perform file delete operation
                deleteFolder({ folderId: selectedFolder._id, caseId });
                console.log('Deleting folder:', selectedFolder.folderName);
                setSelectedFolder(null);
            }
        }
        handleAnchorClose(); // Close the context menu after performing the delete action
        setSelectedFile(null);
        setSelectedFolder(null);
        closeDeleteDialog();
    };

    const openDeleteDialog = () => {
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
    };


    return (
        <DocumentContext.Provider value={{
            currentFolderId,
            setCurrentFolderId,
            selectedFolder,
            setSelectedFolder,
            folderDataForMove,
            setFolderDataForMove,
            selectedFolderForMove,
            setSelectedFolderForMove,
            searchList,
            setSearchList,
            folderStack,
            setFolderStack,
            folderStackForMove,
            setFolderStackForMove,
            folderData,
            fetchContents,
            fetchEverything,
            setOpen,
            open,
            selectedFile,
            setSelectedFile,
            fetchPreview,
            filePreview,
            setFilePreview,
            createFolder,
            uploadFile,
            deleteFile,
            deleteFolder,
            renameFile,
            renameFolder,
            downloadFile,
            moveFile,
            moveFolder,
            fetchFolders,
            moveDialogOpen,
            setMoveDialogOpen,
            anchorPosition,
            setAnchorPosition,
            renameDialogOpen,
            setRenameDialogOpen,
            newName,
            setNewName,
            handleRename,
            handleDownload,
            handleAnchorClose,
            handleDelete,
            openContextMenu,
            setOpenContextMenu,
            contextMenuEvent,
            setContextMenuEvent,
            openDeleteDialog,
            closeDeleteDialog,
            deleteDialogOpen,
            setDeleteDialogOpen
        }}>
            {children}
        </DocumentContext.Provider>
    );
};

export const useDocumentContext = () => useContext(DocumentContext);
