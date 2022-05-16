import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Paper, useMediaQuery, useTheme } from "@mui/material";
import { UserProfile } from "@auth0/nextjs-auth0";
import { PropaneSharp } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import Image from "next/image";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  pictureUrl: string;
};

const Post: React.FC<{ post: PostProps, user:UserProfile | undefined }> = ({ post, user }) => {
  const router = useRouter();

  const authorName = post.author ? post.author.email : "Unknown author";
  const [createdAt, setCreatedAt] = useState<any>()

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deletePost = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { post };
      await fetch('/api/post', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      router.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClose = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    deletePost(e);
    handleClose();
  };

  useEffect(() =>  {
    const myDate = post.createdAt;
    const time = new Date(myDate).toLocaleString();
    setCreatedAt(time);
  }, [])
  
  return (
    <div>
      <Box p={1} pl={3} mb={1} component={Paper}>
      <Box display={'flex'} flexGrow={1}>
        <h2>{post.title}</h2> 
        {user && user.email===post.author?.email && 
      <Grid container justifyContent="flex-end" maxWidth={50}>
        <IconButton onClick={handleClickOpen} aria-label="delete" color='secondary' size='small'>
          <DeleteIcon />
        </IconButton>
      </Grid>
            }
      </Box>

      <small>By {authorName}</small>

      {post.pictureUrl !=="" &&  <Grid sx={{ flexGrow: 1 }} container spacing={0}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={0}>
            <Grid item xs={12} md={6}>
            <Image src={post.pictureUrl} alt="" title="" width="100%" height="100%" layout="responsive" objectFit="contain"/> 
            </Grid>
          </Grid>
        </Grid>
      </Grid>}

      <p>{post.content}</p>
      <small>{createdAt ? <p>createdAt: {createdAt}</p> : ""}</small>
      </Box>

      <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Delete Post"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleDeleteClose} autoFocus>
            Yes
          </Button>
          <Button color="secondary" autoFocus onClick={handleClose}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </div>
  );
};

export default Post;
