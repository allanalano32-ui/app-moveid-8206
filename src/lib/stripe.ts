import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export const PLANS = {
  basic: {
    name: 'Básico',
    price: 2990, // R$ 29,90 em centavos
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    features: [
      '10 análises por mês',
      'Análise básica de movimento',
      'Relatórios em PDF',
      'Suporte por email'
    ]
  },
  premium: {
    name: 'Premium',
    price: 4990, // R$ 49,90 em centavos
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
    features: [
      '50 análises por mês',
      'Análise avançada de biomecânica',
      'Relatórios detalhados',
      'Histórico completo',
      'Suporte prioritário'
    ]
  },
  pro: {
    name: 'Profissional',
    price: 9990, // R$ 99,90 em centavos
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Análises ilimitadas',
      'IA avançada para biomecânica',
      'Relatórios personalizados',
      'API para integração',
      'Suporte 24/7',
      'Consultoria especializada'
    ]
  }
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card', 'pix'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      userId,
    },
  })

  return session
}

export async function createCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name,
  })

  return customer
}

export async function getCustomerSubscriptions(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
  })

  return subscriptions
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId)
  return subscription
}

export { stripe }