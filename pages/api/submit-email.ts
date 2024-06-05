import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      await prisma.email.create({
        data: { address: email },
      });
      res.status(200).json({ message: 'Email stored successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error storing email' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};