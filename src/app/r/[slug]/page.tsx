import { redirect } from "next/navigation"

interface ShortRepRedirectProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ShortRepRedirect({ params, searchParams }: ShortRepRedirectProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams

  const queryString = Object.entries(resolvedSearchParams)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&")

  const target = `/rep/${slug}${queryString ? `?${queryString}` : ""}`
  redirect(target)
}
