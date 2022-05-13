import prisma from '../../../lib/prisma';
import { getSession } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
export default async function handle(req: NextApiRequest, res: NextApiResponse<any>) {
  const { title, content } = req.body;
  const session = getSession(req, res)
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