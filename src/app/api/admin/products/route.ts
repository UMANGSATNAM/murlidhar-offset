import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/admin/products - List all products (including inactive)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { slug: { contains: search } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    if (status === 'active') {
      where.isActive = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              variants: true,
              orderItems: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ])

    const parsedProducts = products.map((product) => ({
      ...product,
      images: JSON.parse(product.images || '[]'),
      variantCount: product._count.variants,
      orderCount: product._count.orderItems,
    }))

    return NextResponse.json({
      products: parsedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching admin products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      slug,
      description,
      shortDesc,
      categoryId,
      images,
      basePrice,
      comparePrice,
      isActive,
      isFeatured,
      isCustomizable,
      templateType,
      minQty,
      maxQty,
      productionDays,
      sortOrder,
      seoTitle,
      seoDesc,
      seoKeywords,
      variantOptions,
      quantityPrices,
      variants,
    } = body

    if (!name || !slug || !categoryId) {
      return NextResponse.json(
        { error: 'name, slug, and categoryId are required' },
        { status: 400 }
      )
    }

    // Check slug uniqueness
    const existing = await db.product.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 409 }
      )
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        description: description || null,
        shortDesc: shortDesc || null,
        categoryId,
        images: JSON.stringify(images || []),
        basePrice: basePrice || 0,
        comparePrice: comparePrice || null,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        isCustomizable: isCustomizable !== undefined ? isCustomizable : true,
        templateType: templateType || 'standard',
        minQty: minQty || 1,
        maxQty: maxQty || 10000,
        productionDays: productionDays || 3,
        sortOrder: sortOrder || 0,
        seoTitle: seoTitle || null,
        seoDesc: seoDesc || null,
        seoKeywords: seoKeywords || null,
      },
    })

    // Create variant options if provided
    if (variantOptions && Array.isArray(variantOptions)) {
      await db.variantOption.createMany({
        data: variantOptions.map((vo: { type: string; label: string; values: string[]; required?: boolean; sortOrder?: number }) => ({
          productId: product.id,
          type: vo.type,
          label: vo.label,
          values: JSON.stringify(vo.values || []),
          required: vo.required !== undefined ? vo.required : true,
          sortOrder: vo.sortOrder || 0,
        })),
      })
    }

    // Create quantity prices if provided
    if (quantityPrices && Array.isArray(quantityPrices)) {
      await db.quantityPrice.createMany({
        data: quantityPrices.map((qp: { minQty: number; maxQty: number; pricePer: number; discount?: number }) => ({
          productId: product.id,
          minQty: qp.minQty,
          maxQty: qp.maxQty,
          pricePer: qp.pricePer,
          discount: qp.discount || 0,
        })),
      })
    }

    // Create variants if provided
    if (variants && Array.isArray(variants)) {
      await db.productVariant.createMany({
        data: variants.map((v: { name: string; sku?: string; price: number; stock?: number; isActive?: boolean; image?: string; attrs?: Record<string, string> }) => ({
          productId: product.id,
          name: v.name,
          sku: v.sku || null,
          price: v.price,
          stock: v.stock || 0,
          isActive: v.isActive !== undefined ? v.isActive : true,
          image: v.image || null,
          attrs: JSON.stringify(v.attrs || {}),
        })),
      })
    }

    // Fetch the complete product
    const completeProduct = await db.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        variants: true,
        variantOptions: true,
        quantityPrices: true,
      },
    })

    return NextResponse.json({ product: completeProduct }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/products - Update a product
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Product id is required' },
        { status: 400 }
      )
    }

    const existing = await db.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Build update object from provided fields
    const data: Record<string, unknown> = {}
    const allowedFields = [
      'name', 'slug', 'description', 'shortDesc', 'categoryId',
      'basePrice', 'comparePrice', 'isActive', 'isFeatured',
      'isCustomizable', 'templateType', 'minQty', 'maxQty',
      'productionDays', 'sortOrder', 'seoTitle', 'seoDesc', 'seoKeywords',
    ]

    for (const field of allowedFields) {
      if (field in updateData) {
        data[field] = updateData[field]
      }
    }

    if (updateData.images !== undefined) {
      data.images = JSON.stringify(updateData.images)
    }

    const product = await db.product.update({
      where: { id },
      data,
      include: {
        category: true,
        variants: true,
        variantOptions: true,
        quantityPrices: true,
      },
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/products - Delete a product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Product id is required' },
        { status: 400 }
      )
    }

    const existing = await db.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    await db.product.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
