import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { subjectId, data, aiLogs, duration } = await req.json();

    if (!subjectId || !data) {
      return NextResponse.json({ error: 'Missing subjectId or data' }, { status: 400 });
    }

    // Server-side validation of mandatory fields
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    const requiredKeys = [
      'm1_div1', 'm1_div2', 'm1_div3', 'm1_rel1', 'm1_rel2', 'm1_rel3', 'm1_eth1', 'm1_eth2', 'm1_eth3', 'm1_fair1', 'm1_fair2', 'm1_fair3', 'm1_und1', 'm1_und2', 'm1_und3', 'm1_und4', 'm1_acc1', 'm1_acc2', 'm1_acc3', 'm1_title',
      'm2_div1', 'm2_div2', 'm2_div3', 'm2_rel1', 'm2_rel2', 'm2_rel3', 'm2_eth1', 'm2_eth2', 'm2_eth3', 'm2_fair1', 'm2_fair2', 'm2_fair3', 'm2_und1', 'm2_und2', 'm2_und3', 'm2_und4', 'm2_acc1', 'm2_acc2', 'm2_acc3', 'm2_title',
      'theory_1', 'theory_2',
      'short_1', 'short_2'
    ];

    for (const key of requiredKeys) {
      if (!parsedData[key] || String(parsedData[key]).trim() === '') {
        return NextResponse.json({ error: `未完成所有必填项: ${key}` }, { status: 400 });
      }
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
