'use client'
// Import necessary hooks and utilities
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import InfiniteProducts from '@modules/products/components/infinite-products';
import RefinementList from '@modules/store/components/refinement-list';
import { StoreGetProductsParams } from '@medusajs/medusa';
import { SortOptions } from '../components/refinement-list/sort-products';

// Fetch function to get products from your API
const fetchProducts = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  console.log("Backend URL : ",baseUrl);
  const response = await fetch(baseUrl+'/store/products');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const StoreTemplate = () => {
  const [params, setParams] = useState<StoreGetProductsParams>({});
  const [sortBy, setSortBy] = useState<SortOptions>('created_at');

  // Use the useQuery hook to fetch products
  const { data, status } = useQuery(['products'], fetchProducts);

  // Handle loading, error, and success states
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error fetching products</div>;
  }

  // Adjust params based on the fetched data to pass to InfiniteProducts
  // This is an example, you might need to adjust the logic based on how you want to use the fetched data
  const adjustedParams = {
    ...params,
    products: data?.products,
  };

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6">
      <RefinementList
        refinementList={params}
        setRefinementList={setParams}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      {/* Pass the adjustedParams or directly use data as needed */}
      <InfiniteProducts params={adjustedParams} sortBy={sortBy} />
    </div>
  );
};

export default StoreTemplate;
