import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { Link } from 'react-router-dom';

export default function SideMenu({width, open, onClose}) {

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

    function sideMenuContent() {
        return (
            <Box>
                <Toolbar/>
                <List>
                    <Link to={'/dashboard'} onClick={() => onClose()} className={'link'}>
                        <ListItem key='Dashboard' disablePadding>
                            <ListItemButton>
                                <ListItemText primary='Tableau de bord' primaryTypographyProps={{variant:'h6'}}/>
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link to={'/productions'} onClick={() => onClose()} className={'link'}>
                        <ListItem key='Productions' disablePadding>
                            <ListItemButton>
                                <ListItemText primary='Productions' primaryTypographyProps={{variant:'h6'}}/>
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link to={'/sales'} onClick={() => onClose()} className={'link'}>
                        <ListItem key='Sales' disablePadding>
                            <ListItemButton>
                                <ListItemText primary='Ventes' primaryTypographyProps={{variant:'h6'}}/>
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link to={'/customers'} onClick={() => onClose()} className={'link'}>
                        <ListItem key='Customers' disablePadding>
                            <ListItemButton>
                                <ListItemText primary='Clients' primaryTypographyProps={{variant:'h6'}}/>
                            </ListItemButton>
                        </ListItem>
                    </Link>
                    <Link to={'/account'} onClick={() => onClose()} className={'link'}>
                        <ListItem key='Account' disablePadding>
                            <ListItemButton>
                                <ListItemText primary='Compte' primaryTypographyProps={{variant:'h6'}}/>
                            </ListItemButton>
                        </ListItem>
                    </Link>
                </List>
            </Box>
        )
    }

    function getDrawer() {
        if (isSmallScreen) {
            return getTemporaryMenuDrawer()
        }
        return getPermanentMenuDrawer()
    }

    function getTemporaryMenuDrawer() {
        return <Drawer
                variant="temporary"
                open={open}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
                }}
            >
            {sideMenuContent()}
        </Drawer>
    }

    function getPermanentMenuDrawer() {
        return <Drawer
                variant="permanent"
                sx={{
                    width: width,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: width },
                }}
            >
            {sideMenuContent()}
        </Drawer>
    }

    return (
        <Box>
            {getDrawer()}
        </Box>
    )
}
