"use client"

import { useMobileMenu } from "@lib/context/mobile-menu-context"
import useToggleState from "@lib/hooks/use-toggle-state"
import Hamburger from "@modules/common/components/hamburger"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import SideMenu from "@modules/layout/components/side-menu"
import MobileMenu from "@modules/mobile-menu/templates"
import DesktopSearchModal from "@modules/search/templates/desktop-search-modal"
import Link from "next/link"
import { getValidSubdomain } from "@lib/subdomain"
import { useQuery } from '@tanstack/react-query' // Import useQuery

async function fetchStoreName(domain: string) {
 
  const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/store_by_domain/?domain=${domain}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  // Extract the name value from the store object
  return data.store.name;
}

const Nav = () => {
  const { toggle } = useMobileMenu()
  const {
    state: searchModalState,
    close: searchModalClose,
    open: searchModalOpen,
  } = useToggleState()

  const subdomain = getValidSubdomain() || 'Cyril' // Default to 'Cyril' if subdomain is null

  // Use React Query to fetch the store name
  const { data: storeName, isLoading, error } = useQuery(['storeName', subdomain], () => fetchStoreName(subdomain), {
    enabled: !!subdomain, // Only run the query if the subdomain exists
  });

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 px-8 mx-auto border-b duration-200 bg-white border-ui-border-base">
        <nav className="txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="block small:hidden">
              <Hamburger setOpen={toggle} />
            </div>
            <div className="hidden small:block h-full">
              <SideMenu searchModalOpen={searchModalOpen} />
            </div>
          </div>

          <div className="flex items-center h-full">
            <Link href="/" className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase">
              {/* Display store name from API or "Loading..." or "Error" */}
              {isLoading ? 'Loading...' : error ? 'Error' : storeName || 'Medusa Store'}
            </Link>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {process.env.FEATURE_SEARCH_ENABLED && (
                <DesktopSearchModal
                  state={searchModalState}
                  close={searchModalClose}
                  open={searchModalOpen}
                />
              )}
              <Link className="hover:text-ui-fg-base" href="/account">
                Account
              </Link>
            </div>
            <CartDropdown />
          </div>
        </nav>
        <MobileMenu />
      </header>
    </div>
  )
}

export default Nav