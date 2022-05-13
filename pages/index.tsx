import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'
import prisma from '../lib/prisma';
import Post, { PostProps } from '../components/Post'

export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await prisma.post.findMany({
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return { props: { feed } };
};

type Props = {
  feed: PostProps[]
}

const Home: NextPage<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
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
