import { generateFeed } from "@/lib/feed";

/**
 * Handles HTTP GET requests that return an Atom feed.
 *
 * @returns {Promise<Response>} A promise that resolves to a Response object containing the Atom feed XML,
 * or an error message with a 500 status code if feed generation fails.
 *
 * @throws Returns a 500 Internal Server Error response if feed generation fails.
 */
export async function GET(): Promise<Response> {
    try {
        const atomFeed = await generateFeed();
        
        return new Response(atomFeed.toString(), {
            headers: {
                'Content-Type': 'application/atom+xml; charset=utf-8',
            }
        });
    } catch(e) {
        console.error('Feed generation error:', e);
        
        return new Response('Internal Server Error', { 
            status: 500,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}