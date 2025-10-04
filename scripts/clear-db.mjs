import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const DATABASE_URI = process.env.DATABASE_URI

if (!DATABASE_URI) {
  console.error('❌ DATABASE_URI not found in environment variables')
  process.exit(1)
}

async function clearDatabase() {
  const client = new MongoClient(DATABASE_URI)

  try {
    console.log('🔌 Connecting to MongoDB...')
    await client.connect()

    const db = client.db()
    console.log(`📊 Database: ${db.databaseName}`)

    const collections = await db.listCollections().toArray()
    console.log(`\n📋 Found ${collections.length} collections:`)
    collections.forEach(col => console.log(`  - ${col.name}`))

    if (collections.length === 0) {
      console.log('\n✅ Database is already empty')
      return
    }

    console.log('\n🗑️  Dropping all collections...')
    for (const collection of collections) {
      await db.collection(collection.name).drop()
      console.log(`  ✓ Dropped: ${collection.name}`)
    }

    console.log('\n✅ Database cleared successfully!')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await client.close()
    console.log('🔌 Disconnected from MongoDB')
  }
}

clearDatabase()
