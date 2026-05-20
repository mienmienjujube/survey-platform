import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // SQLite with Cascade delete should handle responses, 
    // but we can be explicit if needed. 
    // Subject.id is referenced by PreTestResponse and PostTestResponse with onDelete: Cascade
    
    await prisma.subject.deleteMany({});
    
    return NextResponse.json({ success: true, message: '所有受试者数据已清空' });
  } catch (error) {
    console.error('Failed to clear data:', error);
    return NextResponse.json({ error: '清空数据失败' }, { status: 500 });
  }
}
