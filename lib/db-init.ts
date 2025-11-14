import { connectToDatabase } from './mongodb'
import { PROPERTIES_COLLECTION, PROPERTY_INDEXES } from './models/Property'
import { INSIGHTS_COLLECTION, INSIGHT_INDEXES } from './models/Insight'
import { GALLERIES_COLLECTION, GALLERY_INDEXES } from './models/Gallery'
import { SERVICES_COLLECTION, SERVICE_INDEXES } from './models/Service'
import { TEAM_COLLECTION, TEAM_INDEXES } from './models/TeamMember'
import { PROJECTS_COLLECTION, PROJECT_INDEXES } from './models/Project'
import { INQUIRIES_COLLECTION, INQUIRY_INDEXES } from './models/Inquiry'
import { CLIENTS_COLLECTION, CLIENT_INDEXES } from './models/Client'

/**
 * Initialize database indexes for optimal query performance
 * This should be run once during deployment or when database schema changes
 */
export async function initializeDatabase() {
  try {
    const { db } = await connectToDatabase()
    console.log('🔄 Starting database initialization...')

    // Create indexes for Properties collection
    console.log('📋 Creating indexes for Properties collection...')
    const propertiesCollection = db.collection(PROPERTIES_COLLECTION)
    for (const index of PROPERTY_INDEXES) {
      try {
        await propertiesCollection.createIndex(index.key as any, { 
          unique: index.unique || false,
          background: true 
        })
        console.log(`✅ Created index: ${JSON.stringify(index.key)}`)
      } catch (error: any) {
        // Index might already exist
        if (error.code !== 85 && error.code !== 86) {
          console.warn(`⚠️  Warning creating index ${JSON.stringify(index.key)}:`, error.message)
        }
      }
    }

    // Create indexes for Insights collection
    console.log('📋 Creating indexes for Insights collection...')
    const insightsCollection = db.collection(INSIGHTS_COLLECTION)
    for (const index of INSIGHT_INDEXES) {
      try {
        await insightsCollection.createIndex(index.key as any, { 
          unique: index.unique || false,
          background: true 
        })
        console.log(`✅ Created index: ${JSON.stringify(index.key)}`)
      } catch (error: any) {
        if (error.code !== 85 && error.code !== 86) {
          console.warn(`⚠️  Warning creating index ${JSON.stringify(index.key)}:`, error.message)
        }
      }
    }

    // Create indexes for Galleries collection
    console.log('📋 Creating indexes for Galleries collection...')
    const galleriesCollection = db.collection(GALLERIES_COLLECTION)
    for (const index of GALLERY_INDEXES) {
      try {
        await galleriesCollection.createIndex(index.key as any, { 
          background: true 
        })
        console.log(`✅ Created index: ${JSON.stringify(index.key)}`)
      } catch (error: any) {
        if (error.code !== 85 && error.code !== 86) {
          console.warn(`⚠️  Warning creating index ${JSON.stringify(index.key)}:`, error.message)
        }
      }
    }

    // Create indexes for Services collection
    console.log('📋 Creating indexes for Services collection...')
    const servicesCollection = db.collection(SERVICES_COLLECTION)
    for (const index of SERVICE_INDEXES) {
      try {
        await servicesCollection.createIndex(index.key as any, { 
          unique: index.unique || false,
          background: true 
        })
        console.log(`✅ Created index: ${JSON.stringify(index.key)}`)
      } catch (error: any) {
        if (error.code !== 85 && error.code !== 86) {
          console.warn(`⚠️  Warning creating index ${JSON.stringify(index.key)}:`, error.message)
        }
      }
    }

    // Create indexes for Team collection
    console.log('📋 Creating indexes for Team collection...')
    const teamCollection = db.collection(TEAM_COLLECTION)
    for (const index of TEAM_INDEXES) {
      try {
        await teamCollection.createIndex(index.key as any, { 
          unique: index.unique || false,
          background: true 
        })
        console.log(`✅ Created index: ${JSON.stringify(index.key)}`)
      } catch (error: any) {
        if (error.code !== 85 && error.code !== 86) {
          console.warn(`⚠️  Warning creating index ${JSON.stringify(index.key)}:`, error.message)
        }
      }
    }

    // Create indexes for Projects collection
    console.log('📋 Creating indexes for Projects collection...')
    const projectsCollection = db.collection(PROJECTS_COLLECTION)
    for (const index of PROJECT_INDEXES) {
      try {
        await projectsCollection.createIndex(index.key as any, { 
          unique: index.unique || false,
          background: true 
        })
        console.log(`✅ Created index: ${JSON.stringify(index.key)}`)
      } catch (error: any) {
        if (error.code !== 85 && error.code !== 86) {
          console.warn(`⚠️  Warning creating index ${JSON.stringify(index.key)}:`, error.message)
        }
      }
    }

    // Create indexes for Inquiries collection
    console.log('📋 Creating indexes for Inquiries collection...')
    const inquiriesCollection = db.collection(INQUIRIES_COLLECTION)
    for (const index of INQUIRY_INDEXES) {
      try {
        await inquiriesCollection.createIndex(index.key as any, { 
          unique: index.unique || false,
          background: true 
        })
        console.log(`✅ Created index: ${JSON.stringify(index.key)}`)
      } catch (error: any) {
        if (error.code !== 85 && error.code !== 86) {
          console.warn(`⚠️  Warning creating index ${JSON.stringify(index.key)}:`, error.message)
        }
      }
    }

    // Create indexes for Clients collection
    console.log('📋 Creating indexes for Clients collection...')
    const clientsCollection = db.collection(CLIENTS_COLLECTION)
    for (const index of CLIENT_INDEXES) {
      try {
        await clientsCollection.createIndex(index.key as any, { 
          unique: index.unique || false,
          background: true 
        })
        console.log(`✅ Created index: ${JSON.stringify(index.key)}`)
      } catch (error: any) {
        if (error.code !== 85 && error.code !== 86) {
          console.warn(`⚠️  Warning creating index ${JSON.stringify(index.key)}:`, error.message)
        }
      }
    }

    console.log('✅ Database initialization completed successfully!')
    console.log(`📊 Total collections optimized: 8`)
    console.log(`   - Properties, Insights, Galleries`)
    console.log(`   - Services, Team, Projects`)
    console.log(`   - Inquiries, Clients`)
    return { success: true }
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    throw error
  }
}

// Auto-run in development
if (process.env.NODE_ENV === 'development') {
  initializeDatabase().catch(console.error)
}
