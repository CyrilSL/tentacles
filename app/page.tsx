'use client'
import { MedusaProvider } from "medusa-react"
import Storefront from "./storefront"
import { QueryClient } from "@tanstack/react-query"
import React from "react"

const queryClient = new QueryClient()

const App = () => {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="https://octopus-production-47ec.up.railway.app"
    >
      <Storefront />
    </MedusaProvider>
  )
}

export default App
