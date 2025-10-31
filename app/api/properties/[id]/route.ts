import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { PROPERTIES_COLLECTION } from '@/lib/models/Property'
import { ObjectId } from 'mongodb'

// GET /api/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params

    // Try to find by _id or id field
    const filter: any = { $or: [{ id: id }, { slug: id }] }
    if (ObjectId.isValid(id)) {
      filter.$or.unshift({ _id: new ObjectId(id) })
    }
    
    const property = await db.collection(PROPERTIES_COLLECTION).findOne(filter)

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await db.collection(PROPERTIES_COLLECTION).updateOne(
      { _id: property._id },
      { $inc: { views: 1 } }
    )

    return NextResponse.json({ success: true, data: property })
  } catch (error) {
    console.error('Error fetching property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}

// PUT /api/properties/[id] - Update property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()
    const { id } = await params

    // Update slug if title changed
    if (body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    // Remove _id from update data if present
    delete updateData._id

    const filter: any = { $or: [{ id: id }] }
    if (ObjectId.isValid(id)) {
      filter.$or.unshift({ _id: new ObjectId(id) })
    }

    const result = await db.collection(PROPERTIES_COLLECTION).findOneAndUpdate(
      filter,
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error updating property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update property' },
      { status: 500 }
    )
  }
}

// DELETE /api/properties/[id] - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { db } = await connectToDatabase()
    const { id } = await params

    // Soft delete - set isActive to false
    const filter: any = { $or: [{ id: id }] }
    if (ObjectId.isValid(id)) {
      filter.$or.unshift({ _id: new ObjectId(id) })
    }

    const result = await db.collection(PROPERTIES_COLLECTION).findOneAndUpdate(
      filter,
      { $set: { isActive: false, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error deleting property:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}
