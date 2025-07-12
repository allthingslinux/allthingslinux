import { Feed } from "feed";
import { getAllPosts } from '@/lib/blog';

/**
 * Generates an Atom feed containing all posts.
 *
 * @returns {Promise<String>} A promise that resolves to a Feed object populated with post data.
 *
 * @remarks
 * - Fetches all posts using `getAllPosts()`.
 * - Constructs a feed with site and author metadata.
 * - Iterates through each post and adds it as an item to the feed.
 *
 */
export async function generateFeed(): Promise<string> {
    const posts = await getAllPosts();

    const siteUrl = "https://allthingslinux.org";

    const feed = new Feed({
        title: "All Things Linux - Blog",
        description: "All Things Linux fosters a vibrant community of Linux enthusiasts through education, collaboration, and support.",
        id: `${siteUrl}`,
        link: `${siteUrl}/blog`,
        language: "en",
        copyright: "All Rights Reserved 2025, All Things Linux",
        updated: new Date(2025, 7, 6),
        generator: "Feed for All Things Linux, using open-source Node.js Feed generator by jpmonette. ",
        feedLinks: {
           atom: `${siteUrl}/feed`
        },
        author: {
            name: "All Things Linux",
            email: "admin@allthingslinux.org",
            link: `${siteUrl}`
        }
    });

    posts.forEach(post => {
        feed.addItem({
            title: post.title,
            id: `${siteUrl}${post.url}`,
            link: `${siteUrl}${post.url}`,
            description: post.description,
            content: post.body.raw,
            author: [{
                name: "All Things Linux",
                email: "admin@allthingslinux.org",
                link: `${siteUrl}`
            }],
            date: new Date(post.date),
        })
    });

    feed.addCategory("News");

    return feed.atom1();
}