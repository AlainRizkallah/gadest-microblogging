import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout'
import prisma from '../lib/prisma';
import Post, { PostProps } from '../components/Post'
import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { Box, Button, CircularProgress, Grid, Paper, TextField } from '@mui/material'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useInfiniteQuery } from 'react-query';
import React from 'react';
import { InView, useInView } from 'react-intersection-observer';

type Props = {
  feed: PostProps[]
}

const Home: NextPage<Props> = (props) => {
  const { user } = useUser()
  const router = useRouter();
  const {ref, inView} = useInView()


  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [refresh, setRefresh] = useState(true);

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

  useEffect(()=>{
    if(inView && hasNextPage)
    fetchNextPage()
  }, [inView, refresh])
  const {isLoading, isError, data, error, isFetchingNextPage, fetchNextPage, hasNextPage} = useInfiniteQuery('posts', async({ pageParam = ''}) => {
    const res = await axios.get('/api/post?cursor=' + pageParam)
    return res.data
  },{
    getNextPageParam: (lastPage) => lastPage.nextId ?? false,
  })

  console.log(data)

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
        : ""}

          { isLoading ? <CircularProgress color='secondary'/> : ""}
          { isError ? <div>Error!</div> : ""}

          {data && data.pages.map((page)=>(
            <React.Fragment key={page.nextId ?? 'lastpage'}>
              {page.posts.map( (post: PostProps) => (
                <div key={post.id}>
                <Post post={post} user={user} />
                </div>
              ))}
            </React.Fragment>
          ))
          }
     
          {isFetchingNextPage && <CircularProgress color='secondary'/>}
          <span style={{visibility : 'hidden'}} ref={ref}> intersection observer marker</span>
          
        </main>
      </div>
    </Layout>
  )
}

export default Home
