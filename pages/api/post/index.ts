import prisma from '../../../lib/prisma';
import { getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse<any>) {
  const { title, content } = req.body;
  const session = getSession(req, res)
  
  if(req.method === 'POST'){
    if (!session) return { prisma }
  const { user, accessToken } = session
  
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: user?.email } },
    },
  });
  res.json(result);
  }
  if(req.method === 'GET'){
    const limit= 5
    const cursor = req.query.cursor ?? ''
    const cursorObj = cursor === '' ? undefined : {id: (cursor as string) } 
    const posts = await prisma.post.findMany({
      take: limit,
      cursor: cursorObj,
      skip: cursor === '' ? 0 : 1,
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          id: 'desc',
        },
      ],
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });
    return res.json({posts, nextId: posts.length === limit ?  posts[limit - 1].id : undefined })
  }
}