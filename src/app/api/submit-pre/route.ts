import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { subjectId, data, duration } = await req.json();

    if (!subjectId) {
      return NextResponse.json({ error: 'Missing subjectId' }, { status: 400 });
    }

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    const preTest = await prisma.preTestResponse.create({
      data: {
        subjectId,
        data: JSON.stringify(data),
        duration,
        ipAddress
      }
    });

    await prisma.subject.update({
      where: { id: subjectId },
      data: {
        currentPhase: 'POST_TEST',
        currentStep: 1, // Reset step for post-test
        savedState: null // Clear saved state
      }
    });

    return NextResponse.json({ success: true, id: preTest.id });
  } catch (error) {
    console.error('Error submitting pre-test:', error);
    return NextResponse.json({ error: 'Failed to submit pre-test' }, { status: 500 });
  }
}
