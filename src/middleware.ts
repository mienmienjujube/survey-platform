import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Protect /shoowjo and /api/shoowjo
  if (url.pathname.startsWith('/shoowjo') || url.pathname.startsWith('/api/shoowjo')) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return new NextResponse('Authentication Required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Access"',
        },
      });
    }

    try {
      const auth = authHeader.split(' ')[1];
      const decoded = Buffer.from(auth, 'base64').toString().split(':');
      const user = decoded[0];
      const pwd = decoded.slice(1).join(':'); // Handle passwords containing ':'

      const adminUser = process.env.ADMIN_USER;
      const adminPass = process.env.ADMIN_PASSWORD;

      if (!adminUser || !adminPass || user !== adminUser || pwd !== adminPass) {
        return new NextResponse('Invalid Credentials', {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Admin Access"',
          },
        });
      }
    } catch (e) {
      return new NextResponse('Invalid Authorization Format', { status: 400 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/shoowjo/:path*', '/api/shoowjo/:path*'],
};
