import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get('subjectId');

    if (!subjectId) {
      return NextResponse.json({ error: 'Missing subjectId' }, { status: 400 });
    }

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      select: { currentStep: true, savedState: true }
    });

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      step: subject.currentStep, 
      data: subject.savedState ? JSON.parse(subject.savedState) : null 
    });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json({ error: 'Failed to get progress' }, { status: 500 });
  }
}
