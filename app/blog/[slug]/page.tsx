import { getPostBySlug } from "@/lib/utils"

export default async function Page({ params, searchParams }) {
  //return <div>ID: {params.slug}</div>
  const post = await getPostBySlug(params.slug)
  //
  return <div>{post.content}</div>
}