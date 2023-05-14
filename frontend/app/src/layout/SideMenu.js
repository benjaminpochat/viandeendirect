import { useEffect, useState } from 'react';
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { Typography } from '@mui/material';

function SideMenu({open, onClose}) {

    const width = 240;

    function sideMenuContent() {
        return (
            <>
                <Toolbar/>
                <Divider />
                <List>
                    <ListItem key='Sales' disablePadding>
                        <ListItemButton>
                            <ListItemText primary='Ventes'/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='Productions' disablePadding>
                        <ListItemButton>
                            <ListItemText primary='Productions'/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='Customers' disablePadding>
                        <ListItemButton>
                            <ListItemText primary='Clients'/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='Account' disablePadding>
                        <ListItemButton>
                            <ListItemText primary='Compte'/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </>
        )
    }

    return (
        <Box>
            <Drawer
                variant="temporary"
                open={open}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
                }}
            >
                {sideMenuContent()}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { 
                        xs: 'none', 
                        sm: 'block',
                    },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
                }}
            >
                {sideMenuContent()}
            </Drawer>
        </Box>
    )
}

export default SideMenu