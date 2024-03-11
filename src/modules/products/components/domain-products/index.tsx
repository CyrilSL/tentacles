import { getProductsList } from "@lib/data"
import usePreviews from "@lib/hooks/use-previews"
import getNumberOfSkeletons from "@lib/util/get-number-of-skeletons"
import repeat from "@lib/util/repeat"
import { StoreGetProductsParams } from "@medusajs/medusa"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import { useCart } from "medusa-react"
import { useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery } from "@tanstack/react-query"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export type DomainProductsType = {
  params: StoreGetProductsParams
  sortBy?: SortOptions
  subdomain: string
}
interface Product {
  id: string;
  title: string;
  handle: string;
  thumbnail: string;
  price?: {
    calculated_price: string
    original_price: string
    difference: string
    price_type: "default" | "sale"
  }
  isFeatured?: boolean
}
const DomainProducts = ({ params, sortBy, subdomain }: DomainProductsType) => {
  const { cart } = useCart()
  const { ref, inView } = useInView()
  const [domainProducts, setDomainProducts] = useState<Product[]>([])
  const [isLoadingDomainProducts, setIsLoadingDomainProducts] = useState(false)

  const queryParams = useMemo(() => {
    const p: StoreGetProductsParams = {}

    if (cart?.id) {
      p.cart_id = cart.id
    }

    if (cart?.region?.currency_code) {
      p.currency_code = cart.region.currency_code
    }

    p.is_giftcard = false

    return {
      ...p,
      ...params,
    }
  }, [cart?.id, cart?.region, params])

  const { data, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } =
    useInfiniteQuery(
      [`infinite-products-store`, queryParams, cart],
      ({ pageParam }) => getProductsList({ pageParam, queryParams }),
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    )

 

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNextPage])

  useEffect(() => {
    const fetchProductsByDomain = async () => {
      setIsLoadingDomainProducts(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/fetch_by_domain/?domain=${subdomain}`
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setDomainProducts(data.products) // Assuming the API response contains a 'products' array
        console.log("Domain Products: ", data.products)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setDomainProducts([])
      } finally {
        setIsLoadingDomainProducts(false)
      }
    }
    fetchProductsByDomain()
  }, [subdomain])

  return (
    <div className="flex-1 content-container">
      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-3 gap-x-6 gap-y-8 flex-1">
        {domainProducts.map((p) => (
          <li key={p.id}>
            <ProductPreview {...p} />
          </li>
        ))}
        
        {isLoading &&
          !domainProducts.length &&
          repeat(8).map((index) => (
            <li key={index}>
              <SkeletonProductPreview />
            </li>
          ))}
        {isFetchingNextPage &&
          repeat(getNumberOfSkeletons(data?.pages)).map((index) => (
            <li key={index}>
              <SkeletonProductPreview />
            </li>
          ))}
      </ul>
      <div className="py-16 flex justify-center items-center text-small-regular text-gray-700" ref={ref}>
        <span ref={ref}></span>
      </div>

      
    </div>
  )
}

export default DomainProducts