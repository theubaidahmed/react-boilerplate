import { Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '../theme';

const Settings = () => {
    const { mode, toggleTheme } = useTheme();

    return (
        <Grid container>
            <Grid item xs>
                <Typography variant='body1'>Theme</Typography>
            </Grid>
            <Grid item>
                <IconButton onClick={toggleTheme}>
                    {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
            </Grid>
        </Grid>
    );
};

export default Settings;
