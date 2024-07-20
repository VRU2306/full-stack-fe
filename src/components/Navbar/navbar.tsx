import React, { memo, useEffect, useState } from "react";
import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    useScrollTrigger
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import { Profile } from "../../utils/interface";
import Logo from "../../assets/task.png"
const drawerWidth = 240;

export default memo(function Navbar() {
    const userAuth = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profile, setProfile] = useState<Profile>();
    const navigate = useNavigate();
    const handleDrawerToggle = () => {
        setMobileOpen((isOpen) => !isOpen);
    };
    const trigger = useScrollTrigger({
        target: window ? window : undefined,
    });

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} className="flex justify-center items-center flex-col py-4">
            <Link to={'/'}>
                <img className="max-w-[30px]" src={Logo} alt="Logo" />
            </Link>
            <Divider className="w-full" />
            <List className="w-full">
                {userAuth.token ? <>
                    <ListItem className={'w-full'} disablePadding>
                        <ListItemButton onClick={() => userAuth.logOut()} className={'w-full'}
                            sx={{ textAlign: 'center' }}>
                            <ListItemText className="normal-case text-blue-500">Logout</ListItemText>
                        </ListItemButton>
                    </ListItem>
                </> : <>
                    <ListItem className={'w-full'} disablePadding>
                        <ListItemButton className={'w-full'} sx={{ textAlign: 'center' }}>
                            <Link className="w-full" to="/login"><ListItemText
                                className="normal-case ">Login</ListItemText></Link>
                        </ListItemButton>
                    </ListItem>
                    <ListItem className={'w-full'} disablePadding>
                        <ListItemButton className={'w-full'} sx={{ textAlign: 'center' }}>
                            <Link className="w-full" to="/register"><ListItemText
                                className="normal-case ">Sign Up</ListItemText></Link>
                        </ListItemButton>
                    </ListItem>
                </>}
            </List>
        </Box>
    );

    return <>
        <Box sx={{ display: 'flex' }}>
            <AppBar variant="elevation" elevation={!trigger ? 0 : 10}
                color={'transparent'}>
                <Toolbar className="!text-[#222] justify-between w-svw bg-blue-800 border-0 py-2 px-2 md:py-5 md:px-4">
                    <div className="flex gap-2 items-center">
                        <Link to={'/'}>
                            <img className="max-w-[30px]" src={Logo} alt="Logo" />
                        </Link>

                    </div>

                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <div className="flex gap-5">
                        </div>
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
                        {userAuth.token ? <>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                className="!normal-case !text-gray-500"
                            >
                                <div className="flex items-center gap-3 me-4">
                                </div>
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                            </Menu>
                        </> :
                            <>
                                <div className="flex gap-4">
                                    <Link to="/login"><Button
                                        className="!normal-case  !text-white !border-white"
                                        variant={'outlined'}>Login</Button></Link>
                                    <Link to="/register"><Button className="!normal-case !bg-white !text-blue-600"
                                        variant={'contained'}>Sign Up</Button></Link>
                                </div>
                            </>}

                    </Box>

                    <IconButton
                        className="px-3 rounded-full py-1"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
            <Box>
                <Toolbar />
                <Toolbar />
            </Box>
        </Box>
    </>
})