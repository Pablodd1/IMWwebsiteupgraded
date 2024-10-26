import { NextResponse } from "next/server";
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let locales = ['en', 'es'];

// Get the preferred locale, similar to the above or using a library
function getLocale(request) {
    let headers = { 'accept-language': 'en-US,en;q=0.5' }
    let languages = new Negotiator({ headers }).languages()
    let defaultLocale = 'ar'

    return match(languages, locales, defaultLocale);
}

export function middleware(request) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/server/')) {
        return;
    }

    if (pathname.startsWith('/forms/')) {
        return NextResponse.rewrite(new URL('/404', request.url));
    }

    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|gallery|favicon.ico|logos|font|logo.png|robots.txt|sitemap.xml|manifest.json|svg|raster).*)',
    ],
};
