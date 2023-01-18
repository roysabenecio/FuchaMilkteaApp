import { Grid } from '@mui/material';
import React from 'react';

const Layout = ({ navbar, header, pages }) => {
    return (
        <>
            <Grid container>
                <Grid item position={'fixed'} zIndex={100}>
                    {navbar}
                </Grid>
                <Grid
                    item 
                    container 
                    direction='column' 
                    xs 
                    margin={'1em 1em 1em 250px'}
                    position={'modal'}
                    >
                    <Grid item>
                        {header}
                    </Grid>
                    <Grid item>
                        {pages}
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Layout;