export interface ISubscriptionPrices {
  id: string
  displayNamePricing: string
  displayNameInvoice: string
  db: 'MONTHLY' | 'YEARLY' | 'LIFETIME60'
  pricePricing: string
}

export const subscriptionPrices: ISubscriptionPrices[] = [
  {
    id: process.env.NODE_ENV === 'production' ? 'price_1NMJN8CqUvWtrfobxSLqofcO' : 'price_1NLt1oCqUvWtrfobAGHFCdOG',
    displayNamePricing: 'Monthly',
    displayNameInvoice: 'Monthly plan subscription.',
    db: 'MONTHLY',
    pricePricing: '$3',
  },
  {
    id: process.env.NODE_ENV === 'production' ? 'price_1NMJNRCqUvWtrfobl5EarXeW' : 'price_1NMBhECqUvWtrfobBVTgCw7l',
    displayNamePricing: 'Yearly',
    displayNameInvoice: 'Yearly plan subscription.',
    db: 'YEARLY',
    pricePricing: '$30',
  },
  {
    id: process.env.NODE_ENV === 'production' ? 'price_1NMJNqCqUvWtrfobKIDRdMhh' : 'price_1NMBhfCqUvWtrfobZioSuAdP',
    displayNamePricing: 'Lifetime',
    displayNameInvoice: 'Lifetime plan subscription.',
    db: 'LIFETIME60',
    pricePricing: '$60',
  },
]
