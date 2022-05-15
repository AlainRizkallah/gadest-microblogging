import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useUser } from '@auth0/nextjs-auth0';
import { useTheme } from "next-themes";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const pages: any[] = [];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { user, error, isLoading } = useUser();
  // if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const { theme, resolvedTheme, setTheme } = useTheme();


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Home
          </Typography>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Home
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
         
        { !user &&
      <IconButton sx={{ ml: 1 }} onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")} color="inherit">
        {resolvedTheme === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>}

            {user ? <div>
              <IconButton sx={{ ml: 1 }} onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")} color="inherit">
        {resolvedTheme === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton> 

              <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {user.picture ? <Avatar src={user.picture} /> : <Avatar />}
              </IconButton>
            </Tooltip>
          
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            > 
            <Box p={1}>
            <Typography>
              {user.name} 
            </Typography>
            <small>
            ({user.email}) 
            </small>
            </Box>
              
                <MenuItem key={'setting'} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center"><a href="/api/auth/logout"><Button variant='outlined' color='secondary'>Logout</Button></a>  </Typography>
                </MenuItem>
              
            </Menu>

            </div>
            
            : <a href="/api/auth/login"><Button variant='outlined' color='secondary' >Login</Button></a>}
            
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
