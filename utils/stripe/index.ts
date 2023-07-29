import { loadStripe } from '@stripe/stripe-js'
import type { Stripe } from '@stripe/stripe-js'
import * as stripeNode from 'stripe'
import { PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } from '../constant'

let stripePromise: Promise<Stripe | null>

export function stripeClient() {
  if (!stripePromise) {
    stripePromise = loadStripe(PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export const stripeServer = new stripeNode.Stripe(STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2022-11-15',
})
