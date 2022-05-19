import { useUser } from '@auth0/nextjs-auth0';
import { Chip, CircularProgress, Stack } from '@mui/material';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import Layout from '../components/Layout';
import NewPost from '../components/NewPost';
import Post, { PostProps } from '../components/Post';

type Props = {
  feed: PostProps[]
}

const Home: NextPage<Props> = (props) => {
  const { user } = useUser()
  const {ref, inView} = useInView()
  const [orderBy, setOrderBy] = useState('time');

  
  useEffect(()=>{
    if(inView && hasNextPage)
    fetchNextPage()
  }, [inView])
  
  const {isLoading, isError, data, error, isFetchingNextPage, fetchNextPage, hasNextPage}
   = useInfiniteQuery(
     ['posts', orderBy],
      async({ pageParam = ''}) => {
    const res = await axios.get('/api/post?cursor=' + pageParam +'&order=' + orderBy)
    return res.data},
    {getNextPageParam: (lastPage) => lastPage.nextId ?? false,}
    )

    const handleClickMostLiked = () => {
      setOrderBy('like')
    }
    const handleClickMostRecent = () => {
      setOrderBy('time')
    }

  return (
    <Layout>
      <Head>
      <title>Home</title>
        <meta property="og:title" content="Home page title" key="home" />
      </Head>
      <div className="page">
        <main>
          {user ?
          <NewPost/>
        : ""}

      <Stack pt={1} direction="row" spacing={1} justifyContent='center'>
      <Chip label="Most recent" onClick={handleClickMostRecent} variant={orderBy === "time" ? 'filled' : 'outlined'} />
      <Chip label="Most liked" onClick={handleClickMostLiked} variant={orderBy === "like" ? 'filled' : 'outlined'} />
      </Stack>

          { isLoading ?  <Stack direction="row" justifyContent="center" alignItems="center" pt={4}><CircularProgress color='secondary'/></Stack> : ""}
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
