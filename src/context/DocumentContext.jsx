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

    const [anchorPosition, setAnchorPosition] = useState(null);
    const [moveDialogOpen, setMoveDialogOpen] = useState(false);
    const [renameDialogOpen, setRenameDialogOpen] = useState(false); // State for the rename dialog
    const [newName, setNewName] = useState('');

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

    const fetchPreview = async (fileId) => {
        try {
            const params = new URLSearchParams({
                fileId: fileId
            });
            console.log(`${API_URL}/document/previewFile?${params.toString()}`);
            const response = await fetch(`${API_URL}/document/previewFile?${params.toString()}`);
            // Read the response as a blob (binary large object)
            const blob = await response.blob();

            // Create a URL for the blob
            const fileUrl = URL.createObjectURL(blob);
            console.log('Fetched file preview:', fileUrl);

            // Return or set the blob URL for preview in the UI
            return fileUrl;
        } catch (err) {
            console.error('Error fetching file preview:', err);
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

    const downloadFile = async (fileId, fileName) => {
        try {
            const params = new URLSearchParams({ fileId });
            const response = await fetch(`${API_URL}/document/downloadFile?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'download'; // Use the provided fileName or default to 'download'
            document.body.appendChild(a); // Append the anchor to the body
            a.click();
            document.body.removeChild(a); // Remove the anchor from the body
            URL.revokeObjectURL(url); // Revoke the object URL

            console.log('File downloaded:', url);
        } catch (err) {
            console.error('Error downloading file:', err);
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

    const handleAnchorClose = () => {
        setAnchorPosition(null);
        // setSelectedFile(null);
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

        }}>
            {children}
        </DocumentContext.Provider>
    );
};

export const useDocumentContext = () => useContext(DocumentContext);
