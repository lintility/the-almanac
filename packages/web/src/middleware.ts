import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for basic auth header
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Almanac"',
      },
    });
  }

  // Parse the authorization header
  const auth = authHeader.split(' ')[1];
  const [user, password] = Buffer.from(auth, 'base64').toString().split(':');

  // Check credentials (using environment variable for password)
  const validPassword = process.env.ALMANAC_PASSWORD || 'almanac2026';

  if (password !== validPassword) {
    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Almanac"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
