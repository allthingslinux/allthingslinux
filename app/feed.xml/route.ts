import { getAllPosts } from '@/lib/blog';
import { Feed } from "feed";

export async function GET() {

    // move all of this into a util function like generateFeed()
    // then call it from this GET route

    // const posts = await getAllPosts();
    const siteUrl = "https://localhost:3000"

    const feed = new Feed({
        title: "Feed Title",
        description: "This is my personal feed!",
        id: "http://example.com/",
        link: "http://example.com/",
        language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        image: "http://example.com/image.png",
        favicon: "http://example.com/favicon.ico",
        copyright: "All rights reserved 2013, John Doe",
        updated: new Date(2013, 6, 14), // optional, default = today
        generator: "awesome", // optional, default = 'Feed for Node.js'
        feedLinks: {
            // consider adding
        },
        author: {
            name: "John Doe",
            email: "johndoe@example.com",
            link: "https://example.com/johndoe"
        }
  })

    return new Response(feed.atom1(), {
        headers: {
            'Content-Type': 'application/atom+xml; charset=utf-8',
        }
    })
    
}