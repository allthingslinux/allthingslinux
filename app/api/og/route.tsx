import { NextRequest } from 'next/server';

// Remove edge runtime declaration that causes build errors
// export const runtime = 'edge';
export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

// Only declare the promise at top level, don't initialize it
let imageResponsePromise: Promise<any> | null = null;

// This is a workaround for OpenNext + Cloudflare deployment
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Get params from the request
    const category = searchParams.get('category') || 'Blog';
    const date =
      searchParams.get('date') || new Date().toISOString().split('T')[0];

    // Convert date to more readable format
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Define category colors
    const categoryColors: Record<string, string> = {
      news: '#7C4DFF',
      tutorials: '#00BFA5',
      community: '#FF9100',
      projects: '#2979FF',
      guides: '#00C853',
    };

    // Get color based on category or use default
    const accentColor = categoryColors[category.toLowerCase()] || '#90A4AE';

    // Lazy-load ImageResponse to improve startup time
    if (!imageResponsePromise) {
      imageResponsePromise = import('next/og').then((mod) => mod.ImageResponse);
    }

    const { ImageResponse } = await imageResponsePromise;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0A0E15',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '627px',
              background: `linear-gradient(to bottom, ${accentColor}50, transparent)`,
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              padding: '0 80px',
              width: '100%',
              position: 'relative',
            }}
          >
            {/* Logo/Site Name */}
            <div
              style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 30,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              All Things Linux
            </div>

            {/* Category */}
            <div
              style={{
                backgroundColor: accentColor,
                color: '#0A0E15',
                padding: '10px 20px',
                borderRadius: 50,
                fontSize: 28,
                fontWeight: 'bold',
                marginTop: 20,
                marginBottom: 40,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              {category}
            </div>

            {/* Date */}
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: 'white',
                marginBottom: 40,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
            >
              {formattedDate}
            </div>

            {/* Domain */}
            <div
              style={{
                fontSize: 24,
                color: '#BDC3C7',
                marginTop: 40,
              }}
            >
              allthingslinux.org
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 627,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (e) {
    console.error(e);
    // Create the Response inside the function body, not at top level
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
