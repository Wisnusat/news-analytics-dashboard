import {
  RawCategoryGroup,
  CategoryDistributionItem,
  RawDailyTrendItem,
  DailyTrendItem,
} from "./dashboard.types"

// Map Prisma groupBy result to clean category distribution
export function mapCategoryDistribution(
  raw: RawCategoryGroup[]
): CategoryDistributionItem[] {
  return raw.map((item) => ({
    category: item.category,
    count: item._count.category,
  }))
}

// Convert raw SQL daily trend result
export function mapDailyTrend(
  raw: RawDailyTrendItem[]
): DailyTrendItem[] {
  return raw.map((item) => ({
    date: item.date.toISOString().split("T")[0],
    count: Number(item.count),
  }))
}