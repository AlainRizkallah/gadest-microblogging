import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/Layout'
import prisma from '../lib/prisma';
import Post, { PostProps } from '../components/Post'
import { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0'
import { CircularProgress } from '@mui/material'
import axios from 'axios'
import { useInfiniteQuery } from 'react-query';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import NewPost from '../components/NewPost';

type Props = {
  feed: PostProps[]
}

const Home: NextPage<Props> = (props) => {
  const { user } = useUser()
  const {ref, inView} = useInView()


  const [refresh, setRefresh] = useState(true);

  
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

  return (
    <Layout>
      <Head>
      <title>Home</title>
        <meta property="og:title" content="Home page title" key="home" />
      </Head>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {user ?
          <NewPost/>
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
