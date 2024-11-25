import React from 'react';
import { Box } from '@mui/material';

const Background = () => {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url(/geometric-wallpaper-1.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(10px)',
                zIndex: -1,
                backdropFilter: 'blur(8px)'
            }}
        />
    );
};

export default Background;
