import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, Avatar, Typography, Stack, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

const FileFolderDetails = ({ item, handleRename, handleDelete }) => {
    const isFolder = !!item?.folderName;
    const defaultText = "No file or folder selected";

    return (
        <Card sx={{
            maxWidth: 600, mt: 5, 
            borderRadius: 3,
            mr: 2,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: isFolder ? 'primary.main' : 'green' }}>
                        {isFolder ? <FolderIcon /> : <InsertDriveFileIcon />}
                    </Avatar>
                }
                title={item ? (isFolder ? item.folderName : item.fileName) : defaultText}
                subheader={item ? new Date(item.createdAt).toLocaleString() : ''}
                action={
                    item && (
                        <Stack direction="row" spacing={1}>
                            <Tooltip title="Edit">
                                <IconButton color="primary" onClick={() => handleRename()}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton color="error" onClick={() => handleDelete()}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                            {!isFolder && (
                                <Tooltip title="Download">
                                    <IconButton color="success">
                                        <DownloadIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Stack>
                    )
                }
            />
            <Divider />
            <CardContent>
                {item ? (
                    <>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {isFolder ? 'Folder Details' : 'File Details'}
                        </Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="subtitle2">Type:</Typography>
                                <Chip
                                    label={isFolder ? 'Folder' : item.fileType}
                                    color={isFolder ? 'primary' : 'default'}
                                    sx={isFolder ? {} : { backgroundColor: 'green', color: 'white' }}
                                />

                            </Stack>
                            {!isFolder && (<Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="subtitle2">Size:</Typography>
                                <Typography variant="body2">{isFolder ? '-' : `${(item.fileSize / 1024).toFixed(2)} KB`}</Typography>
                            </Stack>)}
                            {!isFolder && (<Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="subtitle2">Uploaded By:</Typography>
                                <Typography variant="body2">{item.uploadedBy.username}</Typography>
                            </Stack>)}
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="subtitle2">Case:</Typography>
                                <Typography variant="body2">{item.caseId.matterName}</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="subtitle2">Path:</Typography>
                                <Typography variant="body2">{item.filePath || item.folderPath}</Typography>
                            </Stack>
                        </Stack>
                    </>
                ) : (
                    <Typography variant="body2" color="textSecondary" component="p">
                        {defaultText}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default FileFolderDetails;
