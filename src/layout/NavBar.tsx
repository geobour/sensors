import React from 'react';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Tooltip,
    Avatar,
    Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from "react-router-dom";
import SensorsIcon from '@mui/icons-material/Sensors';

const avatarSettings = ['Logout'];
const pages = ['HomePage','Sensors','Dashboard', 'Documentation'];

function ResponsiveAppBar({ isLoggedIn, handleLogout }: { isLoggedIn: boolean, handleLogout: () => void }) {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElNav(event.currentTarget);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleLogoutClick = () => {
        handleLogout();
        handleCloseUserMenu();
        navigate("/login");
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#d3d3d3' }}>
            <Toolbar disableGutters>
                <Box sx={{ flexGrow: 0.01 }} />
                <SensorsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'text.secondary' }} />
                <Typography sx={{ color: 'text.secondary', fontWeight: 'bold', ml: 1 }}>
                    MY APP
                </Typography>
                <Box sx={{ flexGrow: 0.01 }} />

                {/* Mobile Menu */}
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                    <IconButton
                        size="large"
                        aria-label="menu"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        sx={{ color: 'text.secondary' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorElNav}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{ display: { xs: 'block', md: 'none' } }}
                    >
                        {pages.map((page) => (
                            <MenuItem key={page} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                                    {page}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                {/* Desktop Menu */}
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                        <Link key={page} to={`/${page.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'text.secondary', fontWeight: 'bold', display: 'block' }}
                            >
                                {page}
                            </Button>
                        </Link>
                    ))}
                </Box>

                {/* Avatar + Settings */}
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}>
                            <Avatar alt="GB" src="/static/images/avatar/2.jpg" />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {avatarSettings.map((setting) => (
                            <MenuItem
                                key={setting}
                                onClick={setting === 'Logout' ? handleLogoutClick : handleCloseUserMenu}
                            >
                                <Typography textAlign="center" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                                    {setting}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default ResponsiveAppBar;
