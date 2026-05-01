import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { subjectId, step, data } = await req.json();

    if (!subjectId) {
      return NextResponse.json({ error: 'Missing subjectId' }, { status: 400 });
    }

    await prisma.subject.update({
      where: { id: subjectId },
      data: {
        currentStep: step,
        savedState: JSON.stringify(data)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save progress error:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}
