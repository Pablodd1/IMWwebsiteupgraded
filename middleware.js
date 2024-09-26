import { NextResponse, userAgent } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const { device, isBot } = userAgent(request);
  const viewport = device.type === 'mobile' ? 'mobile' : 'desktop';
  url.searchParams.set('viewport', viewport);

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|svg|raster|videos).*)',
  ],
};
