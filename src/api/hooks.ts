import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchByIds, fetchCatalog, fetchProduct, fetchShowcase, type CatalogQuery } from './catalog'

export const useCatalog = (q: CatalogQuery) =>
  useQuery({ queryKey: ['catalog', q], queryFn: () => fetchCatalog(q), placeholderData: keepPreviousData })

export const useProduct = (slug: string) => useQuery({ queryKey: ['product', slug], queryFn: () => fetchProduct(slug) })

export const useShowcase = (kind: 'hot' | 'best' | 'new' | 'jdm', limit = 12) =>
  useQuery({ queryKey: ['showcase', kind, limit], queryFn: () => fetchShowcase(kind, limit) })

export const useProductsByIds = (ids: string[]) =>
  useQuery({ queryKey: ['byIds', ids], queryFn: () => fetchByIds(ids), placeholderData: keepPreviousData })
