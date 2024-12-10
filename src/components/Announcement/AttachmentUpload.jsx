import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import muiStyles from "../../styles/muiStyles";

const AttachmentUpload = ({ onAttachmentChange, existingFile, onRemoveFile }) => {
    const [fileName, setFileName] = useState(existingFile ? existingFile.name : "");

    useEffect(() => {
        if (existingFile) {
            console.log("Existing file:", existingFile);
        }
    }, [existingFile]);


    const handleAttachmentChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            onAttachmentChange(file); // Call the parent callback
        } else {
            setFileName("");
            onAttachmentChange(null);
        }
    };

    const handleRemoveFile = () => {
        setFileName("");
        onAttachmentChange(null); // Notify parent that file is removed
        if (onRemoveFile) {
            onRemoveFile(); // Call the parent callback
        }
    };

    const handleRemoveExistingFile = () => {
        setFileName("");
        
        onAttachmentChange(null); // Notify parent that file is removed
        if (onRemoveFile) {
            onRemoveFile(); // Call the parent callback
        }
    }

    return (
        <Box>
            <Typography variant="h6" color="grey">Attachment</Typography>
            {existingFile.fileURI ? (
                <Button
                    variant="contained"
                    component="label"
                    sx={{
                        ...muiStyles.detailsButtonStyle,
                        mt: 1,
                        py: 1,
                        px: 2,
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        "&:hover": {
                            backgroundColor: "#155a9c",
                        },
                    }}
                >
                    Upload File
                    <input
                        type="file"
                        hidden
                        onChange={handleAttachmentChange}
                    />
                </Button>
            ) : null}

            {!existingFile.fileURI ? (
                <Button
                    variant="contained"
                    component="label"
                    sx={{
                        ...muiStyles.detailsButtonStyle,
                        mt: 1,
                        py: 1,
                        px: 2,
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        "&:hover": {
                            backgroundColor: "#155a9c",
                        },
                    }}
                >
                    Upload File
                    <input
                        type="file"
                        hidden
                        onChange={handleAttachmentChange}
                    />
                </Button>
            ) : null}

            {fileName && (
                <>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleRemoveFile}
                        sx={{
                            ...muiStyles.detailsButtonStyle,
                            mt: 1,
                            py: 1,
                            px: 2,
                        }}
                    >
                        Remove File
                    </Button>
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">
                            <b>File:</b> {fileName}
                        </Typography>
                    </Box>
                </>
            )}

            {/* Display existing file information if available */}
            {existingFile.fileURI ? (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                        <b>Existing file:</b> {existingFile.fileName}
                    </Typography>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleRemoveExistingFile}
                        sx={{
                            ...muiStyles.detailsButtonStyle,
                            mt: 1,
                            py: 1,
                            px: 2,
                        }}
                    >
                        Remove File
                    </Button>
                </Box>
            ) : null}


        </Box>
    );
};

export default AttachmentUpload;
