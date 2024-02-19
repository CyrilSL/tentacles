'use client'
// Import necessary hooks and utilities
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import InfiniteProducts from '@modules/products/components/infinite-products';
import RefinementList from '@modules/store/components/refinement-list';
import { StoreGetProductsParams } from '@medusajs/medusa';
import { SortOptions } from '../components/refinement-list/sort-products';

// Updated fetch function to get products from your provided API
const fetchProducts = async () => {
  const apiUrl = "https://octopus-production-47ec.up.railway.app/store/products"; // Provided API endpoint
  console.log("Fetching products from: ", apiUrl);
  const response = await fetch(apiUrl);
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

  // Note: You might need to adjust the logic below based on the structure of your fetched data and how you want to display it
  // Adjust params based on the fetched data to pass to InfiniteProducts
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
