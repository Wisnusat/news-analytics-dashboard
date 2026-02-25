export interface RawCategoryGroup {
  category: string
  _count: {
    category: number
  }
}

export interface CategoryDistributionItem {
  category: string
  count: number
}

export interface RawDailyTrendItem {
  date: Date
  count: number
}

export interface DailyTrendItem {
  date: string
  count: number
}