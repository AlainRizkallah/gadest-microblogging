import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { Box, Button, CircularProgress, Grid, IconButton, Paper, TextField, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image"




const NewPost: React.FC = () => {

  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // TODO: remove any type
  const [image, setImage] = useState<string|Blob|any>('');
  const [createObjectURL, setCreateObjectURL] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  const uploadToClient = (event : any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (post_id : string) => { 
      const filename = encodeURIComponent(image.name)  
      const res = await fetch(`/api/upload-image?file=${post_id}-${filename}`)
      const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${post_id}-${filename}`
      const data = await res.json()
      const body : any = new FormData();
      // @ts-ignore with body : any
      Object.entries({ ...data.fields}).forEach(([key, value]) => {
        body.append(key, value)
      })
      body.append('file', image)
      const res2 = await fetch(data.url, {
        method: 'POST',
        body: body,
      })  
      fetch('/api/post', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id, imageUrl }),
      })
  };

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSubmitted(true)
    try {
      const body = { title, content };
      const post_id : string = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body), 
      }).then(function(response) {
        return response.json();
      }).then(function(post_id) {
        return post_id;
      });
      if(image)
      await uploadToServer(post_id)
      router.reload()
      
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
          <Box component={Paper} p={2} my={1}>
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
            <Grid item xs={12} mb={3}>
              <h4>Post picture</h4>
              <input type="file" name="myImage" onChange={uploadToClient} accept="image/png, image/jpeg" />
              </Grid>
              {createObjectURL && 
              <Grid sx={{ flexGrow: 1 }} container spacing={0} mb={3}>
                <Grid item xs={12}>
                  <Grid container justifyContent="center" spacing={0}>
                    <Grid item xs={6}>
                    <Image src={createObjectURL} alt="" title="" width="100%" height="50%" layout="responsive" objectFit="contain"/> 
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>}
              
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
              {submitted ? <CircularProgress color='secondary'/> :
              <Button  disabled={!content || !title} type="submit" color='secondary'>
                Create 
              </Button>}
            </Grid>
          </Grid>
          </form>
          </Box>
        </div>
  );
};

export default NewPost;
