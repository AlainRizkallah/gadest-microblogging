import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Paper, Skeleton, Stack, useMediaQuery, useTheme } from "@mui/material";
import { UserProfile } from "@auth0/nextjs-auth0";
import { PropaneSharp } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import Image from "next/image";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useQueryClient } from "react-query";

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
  likes:{
    id     :   String;
    user_email :  String;
    post_id :  String;
  }[] | null[];
};

const Post: React.FC<{ post: PostProps, user:UserProfile | undefined }> = ({ post, user }) => {
  const queryClient = useQueryClient()
  const reload = () => {
    queryClient.invalidateQueries('posts')
  }
  function countUnique(iterable: Iterable<unknown> | null | undefined) {
    return new Set(iterable).size;
  }
  const [disabledButton, setDisabledButton] = React.useState(false);

  const router = useRouter();

  const authorName = post.author ? post.author.email : "Unknown author";
  const [createdAt, setCreatedAt] = useState<any>()
  
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const {
    palette: { primary },
  } = useTheme();

  const [isLoaded, setIsLoaded] = React.useState(false);
  
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleLikeClick = () => {
    setDisabledButton(true)
    createLike()
    
  };

  const handleUnLikeClick = () => {
    setDisabledButton(true)
    deleteLike()
  };

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
    const options = { year: "numeric", month: 'long', day: 'numeric', hour: 'numeric', minute:'numeric' } as const;
    const time = new Date(myDate).toLocaleString('en-GB', options);
    setCreatedAt(time);
  }, [])
  
  const likes_users : String[]= []
  post.likes.map((like) => {
    if(like)
    likes_users.push(like.user_email)
  })

  const createLike = async () => {
    try {
      const body = { post, user };
      await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(()=>{setDisabledButton(false)});
      reload()
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteLike = async () => {
    try {
      const body = { post, user };
      await fetch('/api/like', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(()=>{setDisabledButton(false)});
      reload()
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Box p={1} px={2} mb={1} component={Paper}>
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

      {post.pictureUrl !=="" &&  <Grid sx={{ flexGrow: 1 }} container spacing={0} marginTop={3}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" spacing={0}>
            <Grid item xs={12} md={6}>
            <Image src={post.pictureUrl} 
            alt="" 
            title="" 
            width="100%" 
            height="100%" 
            layout="responsive" 
            objectFit="contain"
            onLoad={() => setIsLoaded(true)}/> 
            {!isLoaded && (
            <Stack spacing={1}>
              <Skeleton variant="text" />
              <Skeleton variant="circular" width={50} height={50} />
              <Skeleton variant="rectangular" width={'100%'} height={118} />
            </Stack>
             )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>}

      <p>{post.content}</p>
      <small>{createdAt ? <p>{createdAt}</p> : ""}</small>
      <p>likes: {countUnique(post.likes)}</p>
      {user && user.email && likes_users.includes(user.email) ?
      <IconButton onClick={handleUnLikeClick} disabled={disabledButton} aria-label="delete" color='secondary' size='small'>
        <FavoriteIcon />
      </IconButton>
      :
      <IconButton onClick={handleLikeClick} disabled={disabledButton} aria-label="delete" color='secondary' size='small'>
        <FavoriteBorderIcon />
      </IconButton>
      }
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
