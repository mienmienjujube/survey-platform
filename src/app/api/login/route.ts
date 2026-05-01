import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: '请输入账号和密码' }, { status: 400 });
    }

    const subject = await prisma.subject.findUnique({
      where: { username }
    });

    if (!subject || subject.password !== password) {
      return NextResponse.json({ error: '账号或密码错误' }, { status: 401 });
    }

    if (subject.currentPhase === 'COMPLETED') {
      return NextResponse.json({ error: '该账号已完成问卷，感谢您的参与！' }, { status: 403 });
    }

    return NextResponse.json({ 
      success: true, 
      subjectId: subject.id,
      currentPhase: subject.currentPhase 
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: '系统错误' }, { status: 500 });
  }
}
