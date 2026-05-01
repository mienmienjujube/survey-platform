import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Protect /admin and /api/admin
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return new NextResponse('Authentication Required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Access"',
        },
      });
    }

    const auth = authHeader.split(' ')[1];
    const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':');

    // Use environment variables for credentials
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'survey2026';

    if (user !== adminUser || pwd !== adminPass) {
      return new NextResponse('Invalid Credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Access"',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
