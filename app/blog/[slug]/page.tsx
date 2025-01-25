import { getPostSlugs, getPostBySlug } from "@/lib/utils"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const { default: Post } = await import(`@/markdown/${slug}.mdx`)
  const post = await getPostBySlug(slug)
  const title = post.title || slug


  return <div className="container mx-auto px-4 py-4 max-w-7xl">
    <div className="mb-4">
      <h1 className="text-6xl font-bold mb-2">{title}</h1>
      <p className="text-gray-500">{post.dateformatted}</p>
    </div>
    <div className="prose prose-invert">
      <Post />
    </div>
  </div>
}
 
export function generateStaticParams() {
  return getPostSlugs().then((slugs) => {
    return slugs.map((slug) => {
      return {
        params: {
          slug: slug.replace(/\.mdx$/, ""),
        },
      }
    })
  })
}
 
export const dynamicParams = false
