import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    const subject = await prisma.subject.create({
      data: {}
    });

    return NextResponse.json({ subjectId: subject.id });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Failed to start session' }, { status: 500 });
  }
}
