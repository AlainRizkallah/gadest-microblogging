import { useUser } from '@auth0/nextjs-auth0';
import { CircularProgress, Stack } from '@mui/material';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from 'react-query';
import Layout from '../components/Layout';
import NewPost from '../components/NewPost';
import Post, { PostProps } from '../components/Post';

type Props = {
  feed: PostProps[]
}

const Home: NextPage<Props> = (props) => {
  const { user } = useUser()
  const {ref, inView} = useInView()


  
  useEffect(()=>{
    if(inView && hasNextPage)
    fetchNextPage()
  }, [inView])
  
  const {isLoading, isError, data, error, isFetchingNextPage, fetchNextPage, hasNextPage}
   = useInfiniteQuery(
     'posts',
      async({ pageParam = ''}) => {
    const res = await axios.get('/api/post?cursor=' + pageParam)
    return res.data},
    {getNextPageParam: (lastPage) => lastPage.nextId ?? false,}
    )

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
