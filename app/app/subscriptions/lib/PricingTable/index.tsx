'use client'

import { subscriptionPrices } from '@/app/data/subscriptionPrices'
import Stripe from 'stripe'
import axios, { AxiosRequestConfig } from 'axios'
import { generateUrl } from '@/utils/url'
import { stripeClient } from '@/utils/stripe'
import { Button } from '@/components/ui/button'
import cn from '@/utils/cn'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ErrorToast from '@/components/ErrorToast'

export default function PricingTable({
  stripeCustomerId,
  clerkUserId,
}: {
  stripeCustomerId: string
  clerkUserId: string
}) {
  return (
    <section className='flex items-center justify-center gap-6 flex-wrap'>
      {subscriptionPrices.map((v) => {
        return (
          <Card key={v.id} className={cn('w-fit h-64 grid grid-rows-3')}>
            <CardHeader>
              <CardTitle>{v.displayNamePricing}</CardTitle>
              <CardDescription>
                {(() => {
                  if (v.db === 'LIFETIME60') return 'Limited time only'
                  else if (v.db === 'YEARLY') return 'Free 2 months'
                  else return ''
                })()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h6 className='text-3xl font-bold text-center'>{v.pricePricing}</h6>
            </CardContent>
            <CardFooter>
              <Button
                onClick={async () => {
                  try {
                    const options: AxiosRequestConfig<any> = {
                      method: 'POST',
                      url: generateUrl('/api/stripe/checkout-sessions').href,
                      headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                      },
                      data: {
                        clerkUserId,
                        stripeCustomerId,
                        stripePriceId: v.id,
                      },
                      responseType: 'json',
                    }

                    const { data }: { data: Stripe.Checkout.Session } = await axios.request(options)

                    const stripe = await stripeClient()
                    await stripe!.redirectToCheckout({
                      sessionId: data.id,
                    })
                  } catch (error) {
                    ErrorToast('preparing checkout page', error)
                  }
                }}
                type='button'
              >
                Choose this plan
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </section>
  )
}
