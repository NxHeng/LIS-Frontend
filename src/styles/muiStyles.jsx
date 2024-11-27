import React from 'react';
import { Fade, Zoom, Collapse, Grow, Slide } from '@mui/material';

const buttonStyle = {
    px: 2,
    py: 1,
    borderRadius: 3,
    textAlign: 'left',
    justifyContent: 'flex-start',
    textTransform: 'capitalize',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
};

const muiStyles = {
    buttonStyle: buttonStyle,
    sideNavTitleStyle: {
        display: 'flex',
        justifyContent: 'start',
        px: 1,
        pt: 1,
        pb: .5,
    },
    cardStyle: {
        p: 1,
        height: '100%',
        borderRadius: 3,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
    },
    paperStyle: {
        borderRadius: 5,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.15)'
        }
    },
    detailsButtonStyle: {
        ...buttonStyle,
        mr: 1,
        borderRadius: 3,
        textAlign: 'center',
        justifyContent: 'center',
    },
    DialogSyle: {
        sx: {
            borderRadius: 3,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            padding: 2,
        },
    }
};

export const TransitionSlide = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
));

export const TransitionFade = React.forwardRef((props, ref) => (
    <Fade ref={ref} {...props} timeout={500} />
));

export const TransitionZoom = React.forwardRef((props, ref) => (
    <Zoom ref={ref} {...props} timeout={500} />
));

export const TransitionCollapse = React.forwardRef((props, ref) => (
    <Collapse ref={ref} {...props} timeout={500} />
));

export const TransitionGrow = React.forwardRef((props, ref) => (
    <Grow ref={ref} {...props} timeout={500} />
));

export default muiStyles;