import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        preTest: true,
        postTest: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
