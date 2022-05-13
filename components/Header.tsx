import React from 'react';
import Link from 'next/link';
import { Avatar, Grid, Link as MUILink, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { Box, Button } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0';

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

    const { user, error, isLoading } = useUser();
    // if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

  let left = (
        <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item>
        <Link href="/" passHref>
         <MUILink variant="body2" style={{ textDecoration: 'none' }}>
            <Button variant={isActive("/")? "contained" : "outlined"}>
              Feed
            </Button>
          </MUILink>
        </Link>
        </Grid>
        </Grid>
  );

  let right = null;

  if (isLoading){
    right = (
      <div className="right">
        Loading...
      </div>
    );
  }


  if (!user) {
    right = (
      <div className="right">
        <a href="/api/auth/login"><Button variant='outlined'>Login</Button></a>
      </div>
    );
  }

  if (user) {
    left = (
      <Grid container direction="row" alignItems="center" spacing={1}>
        <Grid item>
        <Link href="/" passHref>
         <MUILink variant="body2" style={{ textDecoration: 'none' }}>
            <Button variant={isActive("/")? "contained" : "outlined"}>
              Feed
            </Button>
          </MUILink>
        </Link>
        </Grid>
        </Grid>
    );
    right = (
      <div className="right">
        <Box display='flex'>
            {user.picture ? <Avatar src={user.picture} /> : <Avatar />}
           
              <Box mx={2}>
            <Typography>
              {user.name} ({user.email})
            </Typography>
              </Box>

              <Grid container direction="row" alignItems="center" spacing={1}>
              <Grid item>
        
              
                  <Box display='inline-block' alignItems='center'>
            <a href="/api/auth/logout"><Button variant='outlined'>Logout</Button></a>
              </Box>
   
              </Grid>
              </Grid>
              
        </Box>
        
      </div>
    );
  }

  return (
    <nav>
    <Box display="flex" p={2} bgcolor='lightgray'>
      {left}
      {right}
    </Box>
    </nav>

  );
};

export default Header;