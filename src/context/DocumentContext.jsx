import React, { createContext, useContext, useState } from 'react';

const DocumentContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const DocumentContextProvider = ({ children }) => {
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

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user._id;

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
        // console.log('HELLO');
        // console.log(caseId, selectedFolderForMove?._id);
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
        }}>
            {children}
        </DocumentContext.Provider>
    );
};

export const useDocumentContext = () => useContext(DocumentContext);
