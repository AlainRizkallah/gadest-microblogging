import React from "react";
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
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div>
      <Box p={1} pl={3} mb={1} component={Paper}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <p>{post.content}</p>
      </Box>
    </div>
  );
};

export default Post;
