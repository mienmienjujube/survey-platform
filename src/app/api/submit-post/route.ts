import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { subjectId, data, aiLogs, duration } = await req.json();

    if (!subjectId) {
      return NextResponse.json({ error: 'Missing subjectId' }, { status: 400 });
    }

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    const postTest = await prisma.postTestResponse.create({
      data: {
        subjectId,
        data: JSON.stringify(data),
        aiLogs: aiLogs,
        duration,
        ipAddress
      }
    });

    // Mark subject as completed
    await prisma.subject.update({
      where: { id: subjectId },
      data: { currentPhase: 'COMPLETED' }
    });

    return NextResponse.json({ success: true, id: postTest.id });
  } catch (error) {
    console.error('Error submitting post-test:', error);
    return NextResponse.json({ error: 'Failed to submit post-test' }, { status: 500 });
  }
}
