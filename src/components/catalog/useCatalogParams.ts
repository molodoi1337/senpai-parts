import { useCallback, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { CatalogQuery, SortKey } from '@/api/catalog'
import type { Condition, PartType } from '@/data/products'
import { useActiveCar } from '@/store/garage'

const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : [])
const num = (v: string | null) => (v && !Number.isNaN(Number(v)) ? Number(v) : undefined)

export type FilterKey = 'cat' | 'brand' | 'type' | 'cond' | 'make' | 'min' | 'max' | 'stock' | 'sale' | 'rating' | 'fit' | 'q' | 'sort' | 'view'

/** Состояние каталога живёт в URL — ссылкой на выдачу можно поделиться */
export function useCatalogParams() {
  const [params, setParams] = useSearchParams()
  const { category } = useParams()
  const navigate = useNavigate()
  const active = useActiveCar()

  const fit = params.get('fit') === '1'
  const cats = category ? [category] : list(params.get('cat'))

  const query: CatalogQuery = useMemo(
    () => ({
      q: params.get('q') ?? undefined,
      cat: cats,
      brand: list(params.get('brand')),
      type: list(params.get('type')) as PartType[],
      condition: list(params.get('cond')) as Condition[],
      make: params.get('make') ?? undefined,
      car: fit && active ? active.gen.id : (params.get('car') ?? undefined),
      priceMin: num(params.get('min')),
      priceMax: num(params.get('max')),
      inStock: params.get('stock') === '1',
      sale: params.get('sale') === '1',
      rating: num(params.get('rating')),
      sort: (params.get('sort') as SortKey) || 'popular',
      page: num(params.get('page')) ?? 1,
      perPage: 24,
    }),
    [params, category, fit, active?.gen.id],
  )

  const update = useCallback(
    (patch: Partial<Record<FilterKey | 'page' | 'car', string | string[] | number | boolean | undefined | null>>, opts: { keepPage?: boolean } = {}) => {
      const next = new URLSearchParams(params)
      let movedCats: string[] | null = null
      for (const [k, raw] of Object.entries(patch)) {
        const v = Array.isArray(raw) ? raw.join(',') : raw === true ? '1' : raw === false || raw == null ? '' : String(raw)
        if (k === 'cat' && category) {
          movedCats = Array.isArray(raw) ? raw : v ? v.split(',') : []
          continue
        }
        if (v) next.set(k, v)
        else next.delete(k)
      }
      if (!opts.keepPage && !('page' in patch)) next.delete('page')
      if (movedCats) {
        // на /catalog/:category мульти-выбор категорий переносим в query-параметр
        if (movedCats.length === 1) {
          navigate({ pathname: `/catalog/${movedCats[0]}`, search: next.toString() })
          return
        }
        if (movedCats.length) next.set('cat', movedCats.join(','))
        navigate({ pathname: '/catalog', search: next.toString() })
        return
      }
      setParams(next, { replace: false })
    },
    [params, setParams, category, navigate],
  )

  const reset = useCallback(() => {
    const keep = new URLSearchParams()
    if (params.get('q')) keep.set('q', params.get('q')!)
    if (params.get('view')) keep.set('view', params.get('view')!)
    navigate({ pathname: '/catalog', search: keep.toString() })
  }, [params, navigate])

  return { query, params, update, reset, fit, category, view: (params.get('view') as 'grid' | 'list') || 'grid' }
}
