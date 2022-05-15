import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Paper, TextField, useMediaQuery, useTheme } from "@mui/material";
import { UserProfile } from "@auth0/nextjs-auth0";
import { PropaneSharp } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';



const NewPost: React.FC = () => {

  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = { title, content };
      await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      router.reload();
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
            <Box component={Paper} p={2} mb={1}>
          <form onSubmit={submitData}>
          <h2>New Post</h2>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
              required
              id="outlined-required"
              label="Title"
              defaultValue="Post Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              color='secondary'
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
              id="outlined-textarea"
              label="Description"
              placeholder="Placeholder"
              multiline
              fullWidth
              rows={4}
              onChange={(e) => setContent(e.target.value)}
              value={content}
              color='secondary'
              />
            </Grid>
            <Grid item xs={12}>
              <Button  disabled={!content || !title} type="submit" color='secondary'>
                Create 
              </Button>
            </Grid>
          </Grid>
          </form>
          </Box>
        </div>
  );
};

export default NewPost;
