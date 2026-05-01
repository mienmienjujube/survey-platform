import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateRandomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: Request) {
  try {
    const { count } = await req.json();
    if (!count || count <= 0) {
      return NextResponse.json({ error: 'Invalid count' }, { status: 400 });
    }

    const accounts = [];
    for (let i = 0; i < count; i++) {
      // 随机生成 6 位中英文、数字组合作为用户名（以小写英文字母+数字代替）
      // 如果用户希望用特定的格式，比如"user_"前缀，可以在此添加，这里我直接给6位随机字符
      const username = generateRandomString(6); 
      // 密码也是 6 位随机
      const password = generateRandomString(6);
      
      accounts.push({ username, password });
    }

    await prisma.subject.createMany({
      data: accounts
    });

    return NextResponse.json({ success: true, count: accounts.length });
  } catch (error) {
    console.error('Failed to generate accounts:', error);
    return NextResponse.json({ error: 'Failed to generate accounts' }, { status: 500 });
  }
}
