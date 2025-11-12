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
    // { label: 'Home', path: '/homepage' },
    { label: 'Sensors', path: '/sensors' },
    { label: 'Sensors Dashboard', path: '/dashboard' },
    { label: 'TTN Dashboard', path: '/sensors-ttn' },
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
        <AppBar position="static" sx={{ backgroundColor: '#512da8' }}>
            <Toolbar disableGutters>
                <Box sx={{ flexGrow: 0.01 }} />
                <SensorsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'white' }} />
                <Box sx={{ flexGrow: 0.01 }} />

                {/* ------------------ Mobile Menu ------------------ */}
                <Box
                    sx={{
                        flexGrow: 1,
                        display: { xs: 'flex', md: 'none' },
                        backgroundColor: '#512da8',
                    }}
                >
                    <IconButton
                        size="large"
                        aria-label="menu"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleOpenNavMenu}
                        sx={{ color: 'white' }}
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
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            '& .MuiPaper-root': {
                                backgroundColor: '#512da8',
                            },
                        }}
                    >
                        {pages.map((page) => (
                            <MenuItem key={page.label} onClick={handleCloseNavMenu}>
                                <Link
                                    to={page.path}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <Typography
                                        textAlign="center"
                                        sx={{ color: 'white', fontWeight: 'bold' }}
                                    >
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
                                sx={{
                                    my: 2,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    display: 'block',
                                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                                }}
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
                            <Avatar
                                alt="GB"
                                sx={{
                                    bgcolor: '#7e57c2',
                                    color: 'white',
                                    '&:hover': {
                                        boxShadow: '0 0 10px rgba(126, 87, 194, 0.6)',
                                        transform: 'scale(1.05)',
                                        transition: 'all 0.3s ease',
                                    },
                                }}
                            >
                                GB
                            </Avatar>

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
                                sx={{
                                    backgroundColor: setting === 'Logout' ? 'whitesmoke' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: setting === 'Logout' ? 'whitesmoke' : 'inherit',
                                    },
                                }}
                            >
                                <Typography
                                    textAlign="center"
                                    sx={{
                                        color: setting === 'Logout' ? '#7e57c2' : '#7e57c2',
                                        fontWeight: 'bold',
                                    }}
                                >
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
