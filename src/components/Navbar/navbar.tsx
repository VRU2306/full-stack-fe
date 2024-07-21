import { memo, useEffect, useState } from "react";
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
    ListItemText,
    Menu,
    Toolbar,
    useScrollTrigger
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthProvider";
import Logo from "../../assets/task.png"
import { Profile } from "utils/interface";
const drawerWidth = 240;

export default memo(function Navbar() {
    const userAuth = useAuth();
    const [profile, setProfile] = useState<Profile>(userAuth.user);
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen((isOpen) => !isOpen);
    };

    useEffect(() => {
        let userData = userAuth.getUserInfo();
        if (userData) {
            setProfile(userData);
        }
    }, []);

    const trigger = useScrollTrigger({
        target: window ? window : undefined,
    });


    const drawer = (
        <Box onClick={handleDrawerToggle} className="flex justify-center items-center flex-col py-4">
            <Link to={'/'}>
                <img className="max-w-[30px]" src={Logo} alt="Logo" />
            </Link>
            <Divider className="w-full" />
            <List className="w-full">
                {userAuth.token ? <>
                    <p className="text-blue-500 items-center mt-2 flex justify-center w-50">Hi, {profile?.name} 👋</p>
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
                            <div className="flex gap-4">
                                <p className="text-white items-center mt-2">Hi, {profile?.name} 👋</p>
                                <Button className="!normal-case !bg-red-500 !text-white" onClick={() => userAuth.logOut()}
                                    variant={'contained'}>Logout</Button>
                            </div>

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
                        className="px-3 rounded-full py-1 !text-white"
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