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

interface ResponsiveAppBarProps {
    isLoggedIn: boolean;
    handleLogout: () => void;
}

const avatarSettings = ['Logout'];

const pages = [
    { label: 'Home', path: '/homepage' },
    { label: 'Sensors', path: '/sensors' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'TTN Dasboard', path: '/sensors-ttn' },
    { label: 'Documentation', path: '/documentation' },
];

const ResponsiveAppBar: React.FC<ResponsiveAppBarProps> = ({ isLoggedIn, handleLogout }) => {
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

                {/* ------------------ Mobile Menu ------------------ */}
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
                            <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                                <Link
                                    to={page.path}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <Typography textAlign="center" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                                        {page.label}
                                    </Typography>
                                </Link>
                            </MenuItem>
                        ))}
                    </Menu>
                </Box>

                {/* ------------------ Desktop Menu ------------------ */}
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    {pages.map((page) => (
                        <Link
                            key={page.label}
                            to={page.path}
                            style={{ textDecoration: 'none' }}
                        >
                            <Button
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'text.secondary', fontWeight: 'bold', display: 'block' }}
                            >
                                {page.label}
                            </Button>
                        </Link>
                    ))}
                </Box>

                {/* ------------------ Avatar + Settings ------------------ */}
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
};

export default ResponsiveAppBar;
