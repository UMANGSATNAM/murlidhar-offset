import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { db } from '@/lib/db'

const ALLOWED_EXTENSIONS = ['pdf', 'png', 'ai', 'psd', 'svg', 'jpg', 'jpeg']
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'application/postscript',
  'image/vnd.adobe.photoshop',
]
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const userId = formData.get('userId') as string | null
    const orderId = formData.get('orderId') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Validate file extension
    const originalName = file.name
    const extension = originalName.split('.').pop()?.toLowerCase() || ''

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { error: `File type .${extension} is not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type) && extension !== 'ai' && extension !== 'psd') {
      return NextResponse.json(
        { error: `MIME type ${file.type} is not allowed` },
        { status: 400 }
      )
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'upload')
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const fileName = `${timestamp}-${safeName}`
    const filePath = path.join(uploadDir, fileName)

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // Determine fileType from extension
    const fileType = extension === 'jpeg' ? 'jpg' : extension

    // Save upload record to database
    const upload = await db.upload.create({
      data: {
        userId,
        fileName: originalName,
        filePath: `/upload/${fileName}`,
        fileSize: file.size,
        fileType,
        mimeType: file.type,
        orderId: orderId || null,
        status: 'pending',
      },
    })

    return NextResponse.json({
      upload: {
        id: upload.id,
        fileName: upload.fileName,
        filePath: upload.filePath,
        fileSize: upload.fileSize,
        fileType: upload.fileType,
        status: upload.status,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
