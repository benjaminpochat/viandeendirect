import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';

function SideMenu({width, open, onClose, selectItem}) {

    function sideMenuContent() {
        return (
            <Box>
                <Toolbar/>
                <List>
                    <ListItem key='Dashboard' disablePadding>
                        <ListItemButton onClick={() => selectItem('DASHBOARD')}>
                            <ListItemText primary='Tableau de bord'/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='Sales' disablePadding>
                        <ListItemButton onClick={() => selectItem('SALES')}>
                            <ListItemText primary='Ventes'/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='Productions' disablePadding>
                        <ListItemButton onClick={() => selectItem('PRODUCTIONS')}>
                            <ListItemText primary='Productions'/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='Customers' disablePadding>
                    <ListItemButton onClick={() => selectItem('CUSTOMERS')}>
                            <ListItemText primary='Clients'/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='Account' disablePadding>
                        <ListItemButton onClick={() => selectItem('GROWER_ACCOUNT')}>
                            <ListItemText primary='Compte'/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
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
                    width: width,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
                }}
            >
                {sideMenuContent()}
            </Drawer>
        </Box>
    )
}

export default SideMenu