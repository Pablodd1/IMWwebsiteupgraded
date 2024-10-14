import { NextResponse } from "next/server";
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
let locales = ['en', 'es']

// Get the preferred locale, similar to the above or using a library
function getLocale(request) {
    let headers = { 'accept-language': 'en-US,en;q=0.5' }
    let languages = new Negotiator({ headers }).languages()
    let defaultLocale = 'ar'

    return match(languages, locales, defaultLocale)
}

export function middleware(request) {
    const { pathname } = request.nextUrl
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) return

    // Redirect if there is no locale
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(request.nextUrl)
}
export const config = {
    matcher: [
      // Add your matcher patterns here
      '/((?!_next/static|_next/image|svg|raster).*)',
    ],
  };