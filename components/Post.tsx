import React, { useEffect, useState } from "react";
import Router from "next/router";
import { Box, Paper } from "@mui/material";

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
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.email : "Unknown author";
  const [createdAt, setCreatedAt] = useState<any>()
  useEffect(() =>  {
    const myDate = post.createdAt;
    const time = new Date(myDate).toLocaleString();
    setCreatedAt(time);
  }, [])
  
  return (
    <div>
      <Box p={1} pl={3} mb={1} component={Paper}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <p>{post.content}</p>
      {createdAt ? <p>createdAt: {createdAt}</p> : ""}
      </Box>
    </div>
  );
};

export default Post;
