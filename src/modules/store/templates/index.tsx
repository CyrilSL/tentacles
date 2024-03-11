"use client"

import { StoreGetProductsParams } from "@medusajs/medusa"
import InfiniteProducts from "@modules/products/components/infinite-products"
import RefinementList from "@modules/store/components/refinement-list"
import { useState } from "react"
import { SortOptions } from "../components/refinement-list/sort-products"
import { getValidSubdomain } from "@lib/subdomain"
import DomainProducts from "@modules/products/components/domain-products"

const StoreTemplate = () => {
  const [params, setParams] = useState<StoreGetProductsParams>({})
  const [sortBy, setSortBy] = useState<SortOptions>("created_at")
  const subdomain = getValidSubdomain() || 'Cyril' // Default to 'Cyril' if subdomain is null

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6">
      <RefinementList
        refinementList={params}
        setRefinementList={setParams}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <h1>Domain Products</h1>

      <DomainProducts params={params} sortBy={sortBy} subdomain={subdomain}/>
      <h1>Infinite Products</h1>
      <InfiniteProducts params={params} sortBy={sortBy} />
    </div>
  )
}

export default StoreTemplate
