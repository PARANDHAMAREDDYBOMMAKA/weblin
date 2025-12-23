import { NextRequest, NextResponse } from 'next/server';

// Use Node.js runtime for better large file streaming support
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Disable caching for dynamic content
export const maxDuration = 60; // Allow up to 60 seconds for large file transfers

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // Whitelist of allowed domains for security
  const allowedDomains = [
    'distro.ibiblio.org',
    'dl-cdn.alpinelinux.org',
    'cdimage.debian.org',
    'mirror.arizona.edu',
    'mirror.rackspace.com',
    'tinycorelinux.net',
  ];

  try {
    const targetUrl = new URL(url);

    // Security check: Only allow whitelisted domains
    if (!allowedDomains.some(domain => targetUrl.hostname.includes(domain))) {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }

    // Get Range header from incoming request
    const rangeHeader = request.headers.get('Range');

    // Build fetch headers
    const fetchHeaders: HeadersInit = {
      'User-Agent': 'Mozilla/5.0 (compatible; WebLinux/1.0)',
    };

    // Forward Range header if present
    if (rangeHeader) {
      fetchHeaders['Range'] = rangeHeader;
    }

    // Fetch the ISO from the external server
    const response = await fetch(url, {
      method: 'GET',
      headers: fetchHeaders,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Create a response with proper CORS headers
    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Range');
    headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');

    // Forward content type
    const contentType = response.headers.get('Content-Type');
    if (contentType) {
      headers.set('Content-Type', contentType);
    }

    // Forward Content-Length
    const contentLength = response.headers.get('Content-Length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    // Forward Content-Range for partial responses
    const contentRange = response.headers.get('Content-Range');
    if (contentRange) {
      headers.set('Content-Range', contentRange);
    }

    // Set Accept-Ranges to indicate range support
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

    // Return with appropriate status (206 for partial content, 200 for full)
    return new NextResponse(response.body, {
      status: response.status, // Will be 206 for partial, 200 for full
      headers,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
    },
  });
}
