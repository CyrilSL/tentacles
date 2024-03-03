import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories, listRegions } from "@lib/data"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: { category: string[]; countryCode: string }
  searchParams: {
    sortBy?: SortOptions
    page?: string
  }
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }
{/* @ts-ignore */}
  const countryCodes = await listRegions().then((regions) =>regions?.map((r) => r.countries.map((c) => c.iso_2)).flat())
{/* @ts-ignore */}
  const categoryHandles = product_categories.map((category) => category.handle)
{/* @ts-ignore */}
  const staticParams = countryCodes?.map((countryCode) =>categoryHandles.map((handle) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // @ts-ignore 
    const { product_categories } = await getCategoryByHandle(params.category).then((product_categories) => product_categories)

    // @ts-ignore 
    const title = product_categories.map((category) => category.name)
      .join(" | ")

    const description =
      product_categories[product_categories.length - 1].description ??
      `${title} category.`

    return {
      title: `${title} | Medusa Store`,
      description,
      alternates: {
        canonical: `${params.category.join("/")}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { sortBy, page } = searchParams
// @ts-ignore 
  const { product_categories } = await getCategoryByHandle(params.category).then((product_categories) => product_categories)

  if (!product_categories) {
    notFound()
  }

  return (
    <CategoryTemplate
      categories={product_categories}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
