import { React, useEffect, useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import FolderView from './FolderView';

import { useDocumentContext } from '../../../context/DocumentContext';

const Documents = () => {

    const { currentFolderId, setCurrentFolderId, folderData, fetchContents, fetchEverything, searchList } = useDocumentContext();
    const caseItem = localStorage.getItem('caseItem');
    const caseId = JSON.parse(caseItem)._id;

    useEffect(() => {
        // console.log(currentFolderId, caseId);
        fetchEverything(caseId);
        fetchContents(caseId);
    }, [currentFolderId, caseId]);

    // useEffect(() => {
    //     console.log(currentFolderId, caseId);
    //     fetchFolders(caseId);
    // }, []);

    // useEffect(() => {
    //     console.log(folderDataForMove);
    // }, [folderDataForMove]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Documents</Typography>
            <FolderView
                searchList={searchList}
                folderData={folderData}
                setCurrentFolderId={setCurrentFolderId}
                currentFolderId={currentFolderId}
            />
        </Container>
    );
}

export default Documents;