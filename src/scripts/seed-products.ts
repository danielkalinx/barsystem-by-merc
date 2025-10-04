import { getPayload } from 'payload'
import config from '@payload-config'

const products = [
  // Getränke (Drinks)
  { name: 'Bier 0,5L', price: 3.5, category: 'Getränke', available: true, popular: true },
  { name: 'Bier 0,33L', price: 2.5, category: 'Getränke', available: true, popular: true },
  { name: 'Radler 0,5L', price: 3.5, category: 'Getränke', available: true, popular: false },
  { name: 'Wein Rot 0,25L', price: 4.0, category: 'Getränke', available: true, popular: false },
  { name: 'Wein Weiß 0,25L', price: 4.0, category: 'Getränke', available: true, popular: false },
  { name: 'Sekt 0,1L', price: 3.5, category: 'Getränke', available: true, popular: false },
  { name: 'Schnaps 2cl', price: 2.0, category: 'Getränke', available: true, popular: true },
  { name: 'Vodka Red Bull', price: 5.0, category: 'Getränke', available: true, popular: true },
  { name: 'Gin Tonic', price: 5.5, category: 'Getränke', available: true, popular: false },
  { name: 'Whisky Cola', price: 5.5, category: 'Getränke', available: true, popular: false },
  { name: 'Cola 0,33L', price: 2.0, category: 'Getränke', available: true, popular: true },
  { name: 'Almdudler 0,33L', price: 2.0, category: 'Getränke', available: true, popular: false },
  { name: 'Spezi 0,33L', price: 2.0, category: 'Getränke', available: true, popular: false },
  { name: 'Wasser 0,5L', price: 1.5, category: 'Getränke', available: true, popular: false },
  { name: 'Red Bull', price: 3.0, category: 'Getränke', available: true, popular: true },

  // Toast
  { name: 'Toast Schinken-Käse', price: 3.0, category: 'Toast', available: true, popular: true },
  { name: 'Toast Salami-Käse', price: 3.0, category: 'Toast', available: true, popular: false },
  { name: 'Toast Thunfisch', price: 3.5, category: 'Toast', available: true, popular: false },
  { name: 'Toast Vegetarisch', price: 2.5, category: 'Toast', available: true, popular: false },

  // Zigarren
  { name: 'Toscano Classico', price: 4.5, category: 'Zigarren', available: true, popular: false },
  { name: 'Villiger Premium No.7', price: 5.0, category: 'Zigarren', available: true, popular: false },
  { name: 'Handelsgold Tip-Cigarillos', price: 3.5, category: 'Zigarren', available: true, popular: true },
  { name: 'Montecristo No.4', price: 12.0, category: 'Zigarren', available: false, popular: false },

  // Snus
  { name: 'General White Portion', price: 5.5, category: 'Snus', available: true, popular: true },
  { name: 'Siberia Red', price: 6.0, category: 'Snus', available: true, popular: false },
  { name: 'Odens Cold Dry', price: 5.0, category: 'Snus', available: true, popular: false },
  { name: 'Velo Ice Cool', price: 5.5, category: 'Snus', available: true, popular: false },
]

// This must be at the top level (not inside a function) for payload run
const payload = await getPayload({ config })

console.log('Seeding products...')

for (const product of products) {
  try {
    const created = await payload.create({
      collection: 'products',
      data: product,
    })
    console.log(`✓ Created product: ${product.name} (€${product.price})`)
  } catch (error) {
    console.error(`✗ Failed to create product ${product.name}:`, error)
  }
}

console.log('Seeding complete!')
process.exit(0)
