import prisma from '../../../lib/prisma';
import { getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse<any>) {
  const session = getSession(req, res)
  if(req.method === 'POST'){
    const { post, prismaUser } = req.body;
    if (!session) return { prisma }
    const { user, accessToken } = session
    const result = await prisma.like.create({
        data: {
        user_email: user.email,
        post_id: post.id,
        },
    });
    return res.json(result.id);
  }
  if(req.method === 'GET'){
    const { post, prismaUser } = req.body;
    const likes = await prisma.like.aggregate({
      _count: {
        id: true,
      },
      where: {
          post_id: post.id,
      }
    });
    return res.json({likes})
  }
  if(req.method === 'DELETE'){
    const { post, prismaUser } = req.body;
    if (!session) return { prisma }
    const { user, accessToken } = session
    
    const result = await prisma.like.deleteMany({
      where: {
        user_email: user.email,
        post_id: post.id
      },
    });
    return res.json(result);
  }
  if(req.method === 'PUT'){
    const { post_id, imageUrl } = req.body;
    const result = await prisma.post.update({
      where: {
        id: post_id,
      },
      data: {
        pictureUrl: imageUrl,
      },
    });
    
  }
}