import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';
export const fetchCache = 'force-no-store';

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
      news: '#7C4DFF', // Enhanced Deep purple (more saturation)
      tutorials: '#00BFA5', // Enhanced Teal
      community: '#FF9100', // Enhanced Orange
      projects: '#2979FF', // Enhanced Blue
      guides: '#00C853', // Enhanced Green
    };

    // Get color based on category or use default
    const accentColor = categoryColors[category.toLowerCase()] || '#90A4AE';

    // Create an evenly distributed dot grid
    const dots: React.ReactNode[] = [];

    const positions = [
      // First row (9 dots, equally spaced)
      { x: 75, y: 75 },
      { x: 225, y: 75 },
      { x: 375, y: 75 },
      { x: 525, y: 75 },
      { x: 675, y: 75 },
      { x: 825, y: 75 },
      { x: 975, y: 75 },
      { x: 1125, y: 75 },

      // Second row (8 dots, offset)
      { x: 150, y: 150 },
      { x: 300, y: 150 },
      { x: 450, y: 150 },
      { x: 600, y: 150 },
      { x: 750, y: 150 },
      { x: 900, y: 150 },
      { x: 1050, y: 150 },

      // Third row (9 dots)
      { x: 75, y: 225 },
      { x: 225, y: 225 },
      { x: 375, y: 225 },
      { x: 525, y: 225 },
      { x: 675, y: 225 },
      { x: 825, y: 225 },
      { x: 975, y: 225 },
      { x: 1125, y: 225 },

      // Fourth row (8 dots, offset)
      { x: 150, y: 300 },
      { x: 300, y: 300 },
      { x: 450, y: 300 },
      { x: 600, y: 300 },
      { x: 750, y: 300 },
      { x: 900, y: 300 },
      { x: 1050, y: 300 },

      // Fifth row (9 dots)
      { x: 75, y: 375 },
      { x: 225, y: 375 },
      { x: 375, y: 375 },
      { x: 525, y: 375 },
      { x: 675, y: 375 },
      { x: 825, y: 375 },
      { x: 975, y: 375 },
      { x: 1125, y: 375 },

      // Sixth row (8 dots, offset)
      { x: 150, y: 450 },
      { x: 300, y: 450 },
      { x: 450, y: 450 },
      { x: 600, y: 450 },
      { x: 750, y: 450 },
      { x: 900, y: 450 },
      { x: 1050, y: 450 },

      // Seventh row (9 dots)
      { x: 75, y: 525 },
      { x: 225, y: 525 },
      { x: 375, y: 525 },
      { x: 525, y: 525 },
      { x: 675, y: 525 },
      { x: 825, y: 525 },
      { x: 975, y: 525 },
      { x: 1125, y: 525 },
    ];

    positions.forEach((pos, i) => {
      dots.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: 6,
            height: 6,
            borderRadius: 4,
            backgroundColor: accentColor,
            opacity: 0.5,
          }}
        />
      );
    });

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
            backgroundColor: '#0A0E15', // Darker background for better contrast
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Render simplified dot pattern */}
          {dots}

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
                borderRadius: 8,
                fontSize: 32,
                fontWeight: 'bold',
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
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
