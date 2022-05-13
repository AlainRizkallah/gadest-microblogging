import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout'
import prisma from '../lib/prisma';
import Post, { PostProps } from '../components/Post'
import { useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { Box, Button, Grid, Paper, TextField } from '@mui/material'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await prisma.post.findMany({
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return { props: { feed } };
};

type Props = {
  feed: PostProps[]
}

const Home: NextPage<Props> = (props) => {
  const { user } = useUser()
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
      await router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {user ?
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
              id="outlined-textarea"
              label="Multiline Placeholder"
              placeholder="Placeholder"
              multiline
              fullWidth
              rows={4}
              onChange={(e) => setContent(e.target.value)}
              value={content}
              />
            </Grid>
            <Grid item xs={12}>
              <Button  disabled={!content || !title} type="submit">
                Create 
              </Button>
            </Grid>
          </Grid>
          </form>
          </Box>
        </div>
        : ""}
        
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>  
          ))}
          
        </main>
      </div>
    </Layout>
  )
}

export default Home
