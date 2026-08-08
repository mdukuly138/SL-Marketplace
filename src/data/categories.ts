export const categories = [
  'Food & Restaurants',
  'Groceries',
  'Phones & Electronics',
  'Fashion',
  'Beauty',
  'Home & Furniture',
  'Vehicles',
  'Services',
  'Agriculture',
  'Jobs',
  'Other',
] as const

export type Category = (typeof categories)[number]
