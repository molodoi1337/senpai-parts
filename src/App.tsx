import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import Home from '@/pages/Home'

const Catalog = lazy(() => import('@/pages/Catalog'))
const ProductPage = lazy(() => import('@/pages/Product'))
const Cart = lazy(() => import('@/pages/Cart'))
const Checkout = lazy(() => import('@/pages/Checkout'))
const OrderSuccess = lazy(() => import('@/pages/OrderSuccess'))
const Wishlist = lazy(() => import('@/pages/Wishlist'))
const Compare = lazy(() => import('@/pages/Compare'))
const Garage = lazy(() => import('@/pages/Garage'))
const Cars = lazy(() => import('@/pages/Cars'))
const CarPage = lazy(() => import('@/pages/CarPage'))
const Vin = lazy(() => import('@/pages/Vin'))
const Account = lazy(() => import('@/pages/Account'))
const Blog = lazy(() => import('@/pages/Blog'))
const Article = lazy(() => import('@/pages/Article'))
const Help = lazy(() => import('@/pages/Help'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/catalog', element: <Catalog /> },
      { path: '/catalog/:category', element: <Catalog /> },
      { path: '/product/:slug', element: <ProductPage /> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/checkout/success/:number', element: <OrderSuccess /> },
      { path: '/wishlist', element: <Wishlist /> },
      { path: '/compare', element: <Compare /> },
      { path: '/garage', element: <Garage /> },
      { path: '/cars', element: <Cars /> },
      { path: '/cars/:genId', element: <CarPage /> },
      { path: '/vin', element: <Vin /> },
      { path: '/account', element: <Account /> },
      { path: '/blog', element: <Blog /> },
      { path: '/blog/:slug', element: <Article /> },
      { path: '/help', element: <Help /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
