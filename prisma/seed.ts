import { db } from '../src/lib/db'

async function main() {
  console.log('🌱 Seeding database...')

  // Clean up existing data (in reverse dependency order)
  console.log('🧹 Cleaning existing data...')
  await db.notification.deleteMany()
  await db.orderNote.deleteMany()
  await db.orderTimeline.deleteMany()
  await db.orderItem.deleteMany()
  await db.order.deleteMany()
  await db.review.deleteMany()
  await db.wishlist.deleteMany()
  await db.cartItem.deleteMany()
  await db.upload.deleteMany()
  await db.design.deleteMany()
  await db.address.deleteMany()
  await db.coupon.deleteMany()
  await db.productFAQ.deleteMany()
  await db.quantityPrice.deleteMany()
  await db.variantOption.deleteMany()
  await db.productVariant.deleteMany()
  await db.product.deleteMany()
  await db.category.deleteMany()
  await db.orderStatus.deleteMany()
  await db.cmsContent.deleteMany()
  await db.siteSetting.deleteMany()
  await db.account.deleteMany()
  await db.session.deleteMany()
  await db.verificationToken.deleteMany()
  await db.user.deleteMany()

  // ==================== ADMIN USER ====================
  console.log('👤 Creating admin user...')
  const adminUser = await db.user.create({
    data: {
      email: 'admin@murlidhar.com',
      name: 'Admin Murlidhar',
      phone: '+91 98765 43210',
      password: 'admin123',
      role: 'super_admin',
      isActive: true,
      emailVerified: true,
    },
  })

  // Sample customer users
  const customer1 = await db.user.create({
    data: {
      email: 'rajesh@example.com',
      name: 'Rajesh Patel',
      phone: '+91 99887 76655',
      password: 'password123',
      role: 'customer',
      isActive: true,
      emailVerified: true,
    },
  })

  const customer2 = await db.user.create({
    data: {
      email: 'priya@example.com',
      name: 'Priya Sharma',
      phone: '+91 88776 65544',
      password: 'password123',
      role: 'customer',
      isActive: true,
      emailVerified: true,
    },
  })

  const customer3 = await db.user.create({
    data: {
      email: 'amit@example.com',
      name: 'Amit Desai',
      phone: '+91 77665 54433',
      password: 'password123',
      role: 'customer',
      isActive: true,
      emailVerified: true,
    },
  })

  const designerUser = await db.user.create({
    data: {
      email: 'designer@murlidhar.com',
      name: 'Vikram Designer',
      phone: '+91 66554 43322',
      password: 'designer123',
      role: 'designer',
      isActive: true,
      emailVerified: true,
    },
  })

  // ==================== CATEGORIES ====================
  console.log('📁 Creating categories...')
  const categoriesData = [
    { name: 'Visiting Cards', slug: 'visiting-cards', description: 'Professional visiting cards and business cards in various finishes and materials', icon: 'CreditCard', sortOrder: 1 },
    { name: 'Wedding Cards', slug: 'wedding-cards', description: 'Elegant wedding invitation cards with premium finishes and designs', icon: 'Heart', sortOrder: 2 },
    { name: 'Bill Books', slug: 'bill-books', description: 'Custom bill books, invoice books, and receipt books for businesses', icon: 'BookOpen', sortOrder: 3 },
    { name: 'Letter Pads', slug: 'letter-pads', description: 'Corporate letter pads and letterheads for professional correspondence', icon: 'FileText', sortOrder: 4 },
    { name: 'Brochures', slug: 'brochures', description: 'Eye-catching brochures in multiple folds and premium paper options', icon: 'Layout', sortOrder: 5 },
    { name: 'Flyers', slug: 'flyers', description: 'Marketing flyers and handbills for promotional campaigns', icon: 'Send', sortOrder: 6 },
    { name: 'Stickers & Labels', slug: 'stickers-labels', description: 'Custom stickers and labels in various shapes and finishes', icon: 'Tag', sortOrder: 7 },
    { name: 'Flex Banners', slug: 'flex-banners', description: 'Large format flex banners for outdoor advertising and events', icon: 'Flag', sortOrder: 8 },
    { name: 'Posters', slug: 'posters', description: 'High-quality posters in various sizes for advertising and decoration', icon: 'Image', sortOrder: 9 },
    { name: 'Packaging', slug: 'packaging', description: 'Custom packaging boxes and product packaging solutions', icon: 'Package', sortOrder: 10 },
    { name: 'Xerox & Lamination', slug: 'xerox-lamination', description: 'Xerox copies, lamination, and document finishing services', icon: 'Copy', sortOrder: 11 },
    { name: 'Custom Printing', slug: 'custom-printing', description: 'Custom printing solutions for unique requirements', icon: 'Settings', sortOrder: 12 },
  ]

  const categories: Record<string, any> = {}
  for (const cat of categoriesData) {
    categories[cat.slug] = await db.category.create({ data: cat })
  }

  // ==================== PRODUCTS ====================
  console.log('📦 Creating products...')

  // Helper to create product with all related data
  async function createProduct(data: {
    name: string
    slug: string
    description: string
    shortDesc: string
    categorySlug: string
    basePrice: number
    comparePrice?: number
    isFeatured?: boolean
    templateType?: string
    minQty?: number
    maxQty?: number
    productionDays?: number
    seoTitle?: string
    seoDesc?: string
    seoKeywords?: string
    variantOptions: { type: string; label: string; values: string[]; required?: boolean; sortOrder?: number }[]
    quantityPrices: { minQty: number; maxQty: number; pricePer: number; discount?: number }[]
    variants: { name: string; sku?: string; price: number; attrs: Record<string, string> }[]
    faqs: { question: string; answer: string; sortOrder?: number }[]
  }) {
    const product = await db.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDesc: data.shortDesc,
        categoryId: categories[data.categorySlug].id,
        basePrice: data.basePrice,
        comparePrice: data.comparePrice,
        isFeatured: data.isFeatured ?? false,
        templateType: data.templateType ?? 'standard',
        minQty: data.minQty ?? 1,
        maxQty: data.maxQty ?? 10000,
        productionDays: data.productionDays ?? 3,
        seoTitle: data.seoTitle,
        seoDesc: data.seoDesc,
        seoKeywords: data.seoKeywords,
      },
    })

    // Create variant options
    for (const vo of data.variantOptions) {
      await db.variantOption.create({
        data: {
          productId: product.id,
          type: vo.type,
          label: vo.label,
          values: JSON.stringify(vo.values),
          required: vo.required ?? true,
          sortOrder: vo.sortOrder ?? 0,
        },
      })
    }

    // Create quantity prices
    for (const qp of data.quantityPrices) {
      await db.quantityPrice.create({
        data: {
          productId: product.id,
          minQty: qp.minQty,
          maxQty: qp.maxQty,
          pricePer: qp.pricePer,
          discount: qp.discount ?? 0,
        },
      })
    }

    // Create variants
    for (const v of data.variants) {
      await db.productVariant.create({
        data: {
          productId: product.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          stock: 1000,
          attrs: JSON.stringify(v.attrs),
        },
      })
    }

    // Create FAQs
    for (const faq of data.faqs) {
      await db.productFAQ.create({
        data: {
          productId: product.id,
          question: faq.question,
          answer: faq.answer,
          sortOrder: faq.sortOrder ?? 0,
        },
      })
    }

    return product
  }

  // 1. Premium Matte Visiting Card
  const visitingCard = await createProduct({
    name: 'Premium Matte Visiting Card',
    slug: 'premium-matte-visiting-card',
    description: 'Make a lasting impression with our premium visiting cards. Available in a variety of finishes including matte, gloss, velvet, spot UV, and foil stamping. Printed on high-quality 300 GSM or 350 GSM paper stock, these cards are perfect for professionals who want to stand out. Choose from standard, square, mini, or US standard sizes.',
    shortDesc: 'Premium visiting cards with matte, gloss, and specialty finishes on high-quality paper stock.',
    categorySlug: 'visiting-cards',
    basePrice: 299,
    comparePrice: 499,
    isFeatured: true,
    templateType: 'business_card',
    minQty: 100,
    maxQty: 25000,
    productionDays: 2,
    seoTitle: 'Premium Matte Visiting Cards - Murlidhar Offset',
    seoDesc: 'Order premium visiting cards with matte, gloss, velvet, spot UV, and foil finishes. Starting at ₹299 for 100 cards.',
    seoKeywords: 'visiting cards, business cards, matte cards, gloss cards, premium cards',
    variantOptions: [
      { type: 'size', label: 'Card Size', values: ['Standard 90x54mm', 'Square 55x55mm', 'Mini 70x40mm', 'US Standard 89x51mm'], sortOrder: 1 },
      { type: 'material', label: 'Paper Material', values: ['300 GSM Matte', '350 GSM Gloss', 'Textured Paper'], sortOrder: 2 },
      { type: 'finish', label: 'Finish', values: ['Matte', 'Gloss', 'Velvet Lamination', 'Spot UV', 'Foil Stamping'], sortOrder: 3 },
    ],
    quantityPrices: [
      { minQty: 100, maxQty: 249, pricePer: 2.99, discount: 0 },
      { minQty: 250, maxQty: 499, pricePer: 1.996, discount: 15 },
      { minQty: 500, maxQty: 999, pricePer: 1.598, discount: 25 },
      { minQty: 1000, maxQty: 2499, pricePer: 1.299, discount: 35 },
      { minQty: 2500, maxQty: 25000, pricePer: 1.1196, discount: 45 },
    ],
    variants: [
      { name: 'Standard 90x54mm + 300 GSM Matte + Matte Finish', sku: 'VC-STD-MAT-MAT', price: 299, attrs: { size: 'Standard 90x54mm', material: '300 GSM Matte', finish: 'Matte' } },
      { name: 'Standard 90x54mm + 350 GSM Gloss + Gloss Finish', sku: 'VC-STD-GLS-GLS', price: 349, attrs: { size: 'Standard 90x54mm', material: '350 GSM Gloss', finish: 'Gloss' } },
      { name: 'Square 55x55mm + 300 GSM Matte + Velvet Lamination', sku: 'VC-SQR-MAT-VLVT', price: 399, attrs: { size: 'Square 55x55mm', material: '300 GSM Matte', finish: 'Velvet Lamination' } },
      { name: 'Mini 70x40mm + 300 GSM Matte + Matte Finish', sku: 'VC-MINI-MAT-MAT', price: 249, attrs: { size: 'Mini 70x40mm', material: '300 GSM Matte', finish: 'Matte' } },
      { name: 'US Standard 89x51mm + 350 GSM Gloss + Spot UV', sku: 'VC-US-GLS-SPUV', price: 449, attrs: { size: 'US Standard 89x51mm', material: '350 GSM Gloss', finish: 'Spot UV' } },
      { name: 'Standard 90x54mm + Textured Paper + Foil Stamping', sku: 'VC-STD-TXT-FOIL', price: 599, attrs: { size: 'Standard 90x54mm', material: 'Textured Paper', finish: 'Foil Stamping' } },
    ],
    faqs: [
      { question: 'What is the standard visiting card size in India?', answer: 'The standard visiting card size in India is 90x54mm (3.5 x 2.1 inches). We also offer Square (55x55mm), Mini (70x40mm), and US Standard (89x51mm) sizes.', sortOrder: 1 },
      { question: 'What is the difference between matte and gloss finish?', answer: 'Matte finish has a smooth, non-shiny appearance that gives a sophisticated look and is easy to write on. Gloss finish has a shiny, reflective surface that makes colors appear more vibrant and eye-catching.', sortOrder: 2 },
      { question: 'What is Spot UV and Foil Stamping?', answer: 'Spot UV is a glossy coating applied to specific areas of the card to create contrast and highlight elements. Foil Stamping applies a thin metallic foil (gold/silver) to create luxurious accent details on your card.', sortOrder: 3 },
    ],
  })

  // 2. Royal Wedding Card
  const weddingCard = await createProduct({
    name: 'Royal Wedding Card',
    slug: 'royal-wedding-card',
    description: 'Celebrate your special day with our exquisite Royal Wedding Cards. Crafted with premium cardstock, handmade paper, or velvet touch materials, these invitations feature stunning gold foil, silver foil, embossed, and UV spot finishes. Available in single card, double card, box card, and scroll card styles. Each card is a work of art that sets the tone for your celebration.',
    shortDesc: 'Exquisite wedding invitations with gold/silver foil, embossed details, and premium materials.',
    categorySlug: 'wedding-cards',
    basePrice: 1499,
    comparePrice: 2499,
    isFeatured: true,
    templateType: 'wedding_card',
    minQty: 50,
    maxQty: 5000,
    productionDays: 7,
    seoTitle: 'Royal Wedding Cards - Premium Invitations - Murlidhar Offset',
    seoDesc: 'Order premium wedding cards with gold foil, silver foil, embossed finishes. Starting at ₹1499 for 50 cards.',
    seoKeywords: 'wedding cards, wedding invitations, royal cards, gold foil cards',
    variantOptions: [
      { type: 'style', label: 'Card Style', values: ['Single Card', 'Double Card', 'Box Card', 'Scroll Card'], sortOrder: 1 },
      { type: 'material', label: 'Card Material', values: ['Premium Cardstock', 'Handmade Paper', 'Velvet Touch'], sortOrder: 2 },
      { type: 'finish', label: 'Finish', values: ['Gold Foil', 'Silver Foil', 'Embossed', 'UV Spot'], sortOrder: 3 },
    ],
    quantityPrices: [
      { minQty: 50, maxQty: 99, pricePer: 29.98, discount: 0 },
      { minQty: 100, maxQty: 199, pricePer: 24.99, discount: 10 },
      { minQty: 200, maxQty: 499, pricePer: 19.995, discount: 20 },
      { minQty: 500, maxQty: 5000, pricePer: 17.998, discount: 30 },
    ],
    variants: [
      { name: 'Single Card + Premium Cardstock + Gold Foil', sku: 'WC-SGL-CS-GF', price: 1499, attrs: { style: 'Single Card', material: 'Premium Cardstock', finish: 'Gold Foil' } },
      { name: 'Double Card + Premium Cardstock + Silver Foil', sku: 'WC-DBL-CS-SF', price: 2199, attrs: { style: 'Double Card', material: 'Premium Cardstock', finish: 'Silver Foil' } },
      { name: 'Box Card + Handmade Paper + Embossed', sku: 'WC-BOX-HMP-EMB', price: 3499, attrs: { style: 'Box Card', material: 'Handmade Paper', finish: 'Embossed' } },
      { name: 'Scroll Card + Velvet Touch + Gold Foil', sku: 'WC-SCR-VT-GF', price: 4999, attrs: { style: 'Scroll Card', material: 'Velvet Touch', finish: 'Gold Foil' } },
    ],
    faqs: [
      { question: 'How many days in advance should I order wedding cards?', answer: 'We recommend ordering your wedding cards at least 3-4 weeks before your planned mailing date. Our production time is 5-7 business days, and you should account for design approval and shipping time.', sortOrder: 1 },
      { question: 'Can I customize the text and design of the wedding card?', answer: 'Yes! All our wedding cards are fully customizable. You can personalize the text, colors, fonts, and design elements. Our design team will work with you to create the perfect invitation.', sortOrder: 2 },
      { question: 'Do you provide matching envelopes and inserts?', answer: 'Yes, all wedding cards come with matching envelopes. We also offer additional inserts for events like mehndi, sangeet, and reception at an additional cost.', sortOrder: 3 },
    ],
  })

  // 3. Professional Bill Book
  const billBook = await createProduct({
    name: 'Professional Bill Book',
    slug: 'professional-bill-book',
    description: 'Keep your business transactions organized with our professional bill books. Available in duplicate, triplicate, and single copy formats, these bill books are printed on quality carbonless paper for clear, smudge-free copies. Custom printed with your company details, logo, and terms.',
    shortDesc: 'Custom printed bill books in duplicate, triplicate, and single copy formats.',
    categorySlug: 'bill-books',
    basePrice: 399,
    comparePrice: 599,
    isFeatured: false,
    templateType: 'standard',
    minQty: 50,
    maxQty: 5000,
    productionDays: 4,
    seoTitle: 'Professional Bill Books - Custom Printed - Murlidhar Offset',
    seoDesc: 'Order custom printed bill books in duplicate, triplicate formats. Starting at ₹399 for 50 sets.',
    variantOptions: [
      { type: 'format', label: 'Book Format', values: ['Duplicate (2 copies)', 'Triplicate (3 copies)', 'Single Copy'], sortOrder: 1 },
      { type: 'size', label: 'Book Size', values: ['A5 (148x210mm)', 'A4 (210x297mm)', 'Half Letter'], sortOrder: 2 },
    ],
    quantityPrices: [
      { minQty: 50, maxQty: 99, pricePer: 7.98, discount: 0 },
      { minQty: 100, maxQty: 199, pricePer: 6.99, discount: 10 },
      { minQty: 200, maxQty: 5000, pricePer: 5.995, discount: 20 },
    ],
    variants: [
      { name: 'Duplicate + A5 Size', sku: 'BB-DUP-A5', price: 399, attrs: { format: 'Duplicate (2 copies)', size: 'A5 (148x210mm)' } },
      { name: 'Triplicate + A5 Size', sku: 'BB-TRI-A5', price: 499, attrs: { format: 'Triplicate (3 copies)', size: 'A5 (148x210mm)' } },
      { name: 'Single Copy + A4 Size', sku: 'BB-SGL-A4', price: 349, attrs: { format: 'Single Copy', size: 'A4 (210x297mm)' } },
    ],
    faqs: [
      { question: 'What is the difference between duplicate and triplicate bill books?', answer: 'Duplicate bill books produce 2 copies (original + 1 copy) using single-sided carbonless paper. Triplicate bill books produce 3 copies (original + 2 copies) using double-sided carbonless paper.', sortOrder: 1 },
      { question: 'Can I add my company logo and GST details?', answer: 'Yes, we can print your company name, logo, address, GST number, and any other business details on the bill book. Just provide the details when placing your order.', sortOrder: 2 },
    ],
  })

  // 4. Corporate Letter Pad
  const letterPad = await createProduct({
    name: 'Corporate Letter Pad',
    slug: 'corporate-letter-pad',
    description: 'Professional letter pads printed on premium quality paper with your company branding. Perfect for official correspondence, quotations, and business communications. Available in A4 size with your company logo, address, and contact details.',
    shortDesc: 'Premium corporate letter pads with custom branding on high-quality paper.',
    categorySlug: 'letter-pads',
    basePrice: 499,
    comparePrice: 749,
    isFeatured: false,
    templateType: 'standard',
    minQty: 50,
    maxQty: 5000,
    productionDays: 3,
    seoTitle: 'Corporate Letter Pads - Custom Printed - Murlidhar Offset',
    seoDesc: 'Order custom printed corporate letter pads. Starting at ₹499 for 50 sheets.',
    variantOptions: [
      { type: 'size', label: 'Paper Size', values: ['A4 (210x297mm)', 'Legal (216x356mm)', 'A5 (148x210mm)'], sortOrder: 1 },
      { type: 'paper', label: 'Paper Quality', values: ['80 GSM Bond', '100 GSM Premium', '120 GSM Executive'], sortOrder: 2 },
    ],
    quantityPrices: [
      { minQty: 50, maxQty: 99, pricePer: 9.98, discount: 0 },
      { minQty: 100, maxQty: 249, pricePer: 8.49, discount: 10 },
      { minQty: 250, maxQty: 5000, pricePer: 7.196, discount: 20 },
    ],
    variants: [
      { name: 'A4 + 80 GSM Bond', sku: 'LP-A4-80', price: 499, attrs: { size: 'A4 (210x297mm)', paper: '80 GSM Bond' } },
      { name: 'A4 + 100 GSM Premium', sku: 'LP-A4-100', price: 649, attrs: { size: 'A4 (210x297mm)', paper: '100 GSM Premium' } },
      { name: 'Legal + 120 GSM Executive', sku: 'LP-LEG-120', price: 799, attrs: { size: 'Legal (216x356mm)', paper: '120 GSM Executive' } },
    ],
    faqs: [
      { question: 'What paper quality is best for letter pads?', answer: 'For everyday business use, 80 GSM Bond paper is ideal. For premium correspondence and client-facing letters, we recommend 100 GSM Premium or 120 GSM Executive paper for a more professional feel.', sortOrder: 1 },
      { question: 'Can I print on both sides of the letter pad?', answer: 'Yes, we offer both single-sided and double-sided printing. The header is printed on the first page, and we can include a watermark or subtle branding on subsequent pages.', sortOrder: 2 },
    ],
  })

  // 5. Premium Brochure
  const brochure = await createProduct({
    name: 'Premium Brochure',
    slug: 'premium-brochure',
    description: 'Showcase your products and services with our premium brochures. Available in bi-fold, tri-fold, Z-fold, and gate fold styles, these brochures are printed on high-quality glossy or matte paper. Perfect for business presentations, trade shows, and marketing campaigns.',
    shortDesc: 'High-quality brochures in bi-fold, tri-fold, Z-fold, and gate fold styles.',
    categorySlug: 'brochures',
    basePrice: 999,
    comparePrice: 1499,
    isFeatured: true,
    templateType: 'standard',
    minQty: 100,
    maxQty: 10000,
    productionDays: 4,
    seoTitle: 'Premium Brochures - Custom Printed - Murlidhar Offset',
    seoDesc: 'Order premium brochures in bi-fold, tri-fold, Z-fold styles. Starting at ₹999 for 100 brochures.',
    variantOptions: [
      { type: 'fold', label: 'Fold Type', values: ['Bi-Fold', 'Tri-Fold', 'Z-Fold', 'Gate Fold'], sortOrder: 1 },
      { type: 'paper', label: 'Paper Quality', values: ['170 GSM Gloss', '200 GSM Matte', '250 GSM Premium'], sortOrder: 2 },
      { type: 'sides', label: 'Print Sides', values: ['Single Side', 'Double Side'], sortOrder: 3 },
    ],
    quantityPrices: [
      { minQty: 100, maxQty: 249, pricePer: 9.99, discount: 0 },
      { minQty: 250, maxQty: 499, pricePer: 7.996, discount: 15 },
      { minQty: 500, maxQty: 10000, pricePer: 6.998, discount: 25 },
    ],
    variants: [
      { name: 'Bi-Fold + 170 GSM Gloss + Double Side', sku: 'BR-BF-170-DS', price: 999, attrs: { fold: 'Bi-Fold', paper: '170 GSM Gloss', sides: 'Double Side' } },
      { name: 'Tri-Fold + 200 GSM Matte + Double Side', sku: 'BR-TF-200-DS', price: 1199, attrs: { fold: 'Tri-Fold', paper: '200 GSM Matte', sides: 'Double Side' } },
      { name: 'Z-Fold + 250 GSM Premium + Double Side', sku: 'BR-ZF-250-DS', price: 1399, attrs: { fold: 'Z-Fold', paper: '250 GSM Premium', sides: 'Double Side' } },
      { name: 'Gate Fold + 250 GSM Premium + Double Side', sku: 'BR-GF-250-DS', price: 1599, attrs: { fold: 'Gate Fold', paper: '250 GSM Premium', sides: 'Double Side' } },
    ],
    faqs: [
      { question: 'Which fold type is best for my brochure?', answer: 'Bi-fold is ideal for simple product showcases, tri-fold is great for detailed information with 6 panels, Z-fold works well for step-by-step presentations, and gate fold makes a dramatic first impression for premium products.', sortOrder: 1 },
      { question: 'What is the standard brochure size?', answer: 'The standard brochure size is A4 (210x297mm) when unfolded. After folding, bi-fold becomes A5, tri-fold creates 3 equal panels of approximately 99x210mm each.', sortOrder: 2 },
      { question: 'Do you offer design services for brochures?', answer: 'Yes! Our design team can create professional brochure designs based on your requirements. Share your content and brand guidelines, and we will create a stunning design for you.', sortOrder: 3 },
    ],
  })

  // 6. Marketing Flyer
  const flyer = await createProduct({
    name: 'Marketing Flyer',
    slug: 'marketing-flyer',
    description: 'Get your message across with our high-impact marketing flyers. Printed on premium glossy or matte paper, these flyers are perfect for promotional events, product launches, and business advertising. Available in A5, A4, and A3 sizes.',
    shortDesc: 'High-impact marketing flyers for promotions and advertising.',
    categorySlug: 'flyers',
    basePrice: 599,
    comparePrice: 899,
    isFeatured: false,
    templateType: 'standard',
    minQty: 100,
    maxQty: 50000,
    productionDays: 2,
    seoTitle: 'Marketing Flyers - Custom Printed - Murlidhar Offset',
    seoDesc: 'Order marketing flyers in various sizes and finishes. Starting at ₹599 for 100 flyers.',
    variantOptions: [
      { type: 'size', label: 'Flyer Size', values: ['A5 (148x210mm)', 'A4 (210x297mm)', 'A3 (297x420mm)'], sortOrder: 1 },
      { type: 'paper', label: 'Paper Quality', values: ['130 GSM Gloss', '170 GSM Gloss', '200 GSM Matte'], sortOrder: 2 },
      { type: 'sides', label: 'Print Sides', values: ['Single Side', 'Double Side'], sortOrder: 3 },
    ],
    quantityPrices: [
      { minQty: 100, maxQty: 249, pricePer: 5.99, discount: 0 },
      { minQty: 250, maxQty: 499, pricePer: 4.796, discount: 15 },
      { minQty: 500, maxQty: 999, pricePer: 3.998, discount: 25 },
      { minQty: 1000, maxQty: 50000, pricePer: 3.499, discount: 35 },
    ],
    variants: [
      { name: 'A5 + 130 GSM Gloss + Single Side', sku: 'FL-A5-130-SS', price: 599, attrs: { size: 'A5 (148x210mm)', paper: '130 GSM Gloss', sides: 'Single Side' } },
      { name: 'A4 + 170 GSM Gloss + Double Side', sku: 'FL-A4-170-DS', price: 899, attrs: { size: 'A4 (210x297mm)', paper: '170 GSM Gloss', sides: 'Double Side' } },
      { name: 'A3 + 200 GSM Matte + Double Side', sku: 'FL-A3-200-DS', price: 1299, attrs: { size: 'A3 (297x420mm)', paper: '200 GSM Matte', sides: 'Double Side' } },
    ],
    faqs: [
      { question: 'What is the most popular flyer size?', answer: 'A5 (148x210mm) is the most popular and cost-effective size for flyers. A4 is great when you need more space for information, while A3 works well for posters and window displays.', sortOrder: 1 },
      { question: 'Should I choose single or double-sided printing?', answer: 'Single-sided flyers are great for simple promotions and handouts. Double-sided printing allows you to include more information, images, and a call-to-action on the back, making them more versatile.', sortOrder: 2 },
    ],
  })

  // 7. Custom Stickers
  const sticker = await createProduct({
    name: 'Custom Stickers',
    slug: 'custom-stickers',
    description: 'Express your brand with custom stickers and labels. Available in die-cut, kiss-cut, and sheet formats, our stickers are printed on premium vinyl with waterproof and UV-resistant inks. Perfect for product labeling, branding, packaging, and promotional purposes.',
    shortDesc: 'Custom die-cut, kiss-cut, and sheet stickers in various shapes and finishes.',
    categorySlug: 'stickers-labels',
    basePrice: 199,
    comparePrice: 349,
    isFeatured: true,
    templateType: 'standard',
    minQty: 50,
    maxQty: 10000,
    productionDays: 3,
    seoTitle: 'Custom Stickers & Labels - Murlidhar Offset',
    seoDesc: 'Order custom stickers in die-cut, kiss-cut, and sheet formats. Starting at ₹199 for 50 stickers.',
    variantOptions: [
      { type: 'type', label: 'Sticker Type', values: ['Die-Cut (Custom Shape)', 'Kiss-Cut (Square/Rectangle)', 'Sticker Sheet'], sortOrder: 1 },
      { type: 'material', label: 'Material', values: ['Glossy Vinyl', 'Matte Vinyl', 'Transparent', 'Holographic'], sortOrder: 2 },
      { type: 'size', label: 'Sticker Size', values: ['Small (2x2 inch)', 'Medium (3x3 inch)', 'Large (4x4 inch)', 'Custom Size'], sortOrder: 3 },
    ],
    quantityPrices: [
      { minQty: 50, maxQty: 99, pricePer: 3.98, discount: 0 },
      { minQty: 100, maxQty: 249, pricePer: 3.49, discount: 10 },
      { minQty: 250, maxQty: 499, pricePer: 2.796, discount: 20 },
      { minQty: 500, maxQty: 10000, pricePer: 2.398, discount: 30 },
    ],
    variants: [
      { name: 'Die-Cut + Glossy Vinyl + Medium (3x3 inch)', sku: 'ST-DC-GV-MED', price: 199, attrs: { type: 'Die-Cut (Custom Shape)', material: 'Glossy Vinyl', size: 'Medium (3x3 inch)' } },
      { name: 'Kiss-Cut + Matte Vinyl + Large (4x4 inch)', sku: 'ST-KC-MV-LRG', price: 249, attrs: { type: 'Kiss-Cut (Square/Rectangle)', material: 'Matte Vinyl', size: 'Large (4x4 inch)' } },
      { name: 'Sticker Sheet + Glossy Vinyl + A5 Size', sku: 'ST-SH-GV-A5', price: 349, attrs: { type: 'Sticker Sheet', material: 'Glossy Vinyl', size: 'Small (2x2 inch)' } },
      { name: 'Die-Cut + Transparent + Medium (3x3 inch)', sku: 'ST-DC-TP-MED', price: 299, attrs: { type: 'Die-Cut (Custom Shape)', material: 'Transparent', size: 'Medium (3x3 inch)' } },
      { name: 'Die-Cut + Holographic + Medium (3x3 inch)', sku: 'ST-DC-HG-MED', price: 399, attrs: { type: 'Die-Cut (Custom Shape)', material: 'Holographic', size: 'Medium (3x3 inch)' } },
    ],
    faqs: [
      { question: 'What is the difference between die-cut and kiss-cut stickers?', answer: 'Die-cut stickers are cut through both the vinyl and the backing, creating a custom shape. Kiss-cut stickers are cut only through the vinyl layer, leaving the backing intact, making them easier to peel.', sortOrder: 1 },
      { question: 'Are your stickers waterproof?', answer: 'Yes! All our vinyl stickers are waterproof and weather-resistant. They are printed with UV-resistant inks that prevent fading, making them suitable for both indoor and outdoor use.', sortOrder: 2 },
      { question: 'Can I get stickers in a custom shape?', answer: 'Absolutely! Our die-cut stickers can be cut to any custom shape you desire - circles, ovals, custom outlines, or any unique shape. Just provide the design with a cut line.', sortOrder: 3 },
    ],
  })

  // 8. Flex Banner
  const flexBanner = await createProduct({
    name: 'Flex Banner',
    slug: 'flex-banner',
    description: 'Make a big impact with our durable flex banners. Printed using high-resolution UV or eco-solvent inks on premium flex material, these banners are perfect for outdoor advertising, events, exhibitions, and shop frontages. Weather-resistant and long-lasting.',
    shortDesc: 'Durable flex banners for outdoor advertising and events.',
    categorySlug: 'flex-banners',
    basePrice: 249,
    comparePrice: 399,
    isFeatured: false,
    templateType: 'standard',
    minQty: 1,
    maxQty: 100,
    productionDays: 2,
    seoTitle: 'Flex Banners - Outdoor Advertising - Murlidhar Offset',
    seoDesc: 'Order high-quality flex banners for outdoor advertising. Starting at ₹249 per square foot.',
    variantOptions: [
      { type: 'size', label: 'Banner Size', values: ['3x5 ft', '4x8 ft', '5x10 ft', '8x12 ft', 'Custom Size'], sortOrder: 1 },
      { type: 'print', label: 'Print Quality', values: ['720 DPI Standard', '1200 DPI High Resolution'], sortOrder: 2 },
      { type: 'finish', label: 'Finish', values: ['Frontlit', 'Backlit', 'Mesh'], sortOrder: 3 },
    ],
    quantityPrices: [
      { minQty: 1, maxQty: 4, pricePer: 249, discount: 0 },
      { minQty: 5, maxQty: 9, pricePer: 199.8, discount: 15 },
      { minQty: 10, maxQty: 100, pricePer: 179.9, discount: 25 },
    ],
    variants: [
      { name: '3x5 ft + 720 DPI + Frontlit', sku: 'FB-3x5-720-FL', price: 249, attrs: { size: '3x5 ft', print: '720 DPI Standard', finish: 'Frontlit' } },
      { name: '4x8 ft + 720 DPI + Frontlit', sku: 'FB-4x8-720-FL', price: 499, attrs: { size: '4x8 ft', print: '720 DPI Standard', finish: 'Frontlit' } },
      { name: '5x10 ft + 1200 DPI + Backlit', sku: 'FB-5x10-1200-BL', price: 999, attrs: { size: '5x10 ft', print: '1200 DPI High Resolution', finish: 'Backlit' } },
      { name: '8x12 ft + 1200 DPI + Frontlit', sku: 'FB-8x12-1200-FL', price: 1499, attrs: { size: '8x12 ft', print: '1200 DPI High Resolution', finish: 'Frontlit' } },
    ],
    faqs: [
      { question: 'What is the difference between frontlit and backlit flex?', answer: 'Frontlit flex is designed for banners lit from the front (standard outdoor use). Backlit flex is translucent and designed for light box displays where light comes from behind the banner, creating a glowing effect.', sortOrder: 1 },
      { question: 'Are flex banners weather-resistant?', answer: 'Yes, our flex banners are made from weather-resistant PVC material that can withstand rain, sunlight, and wind. They are printed with UV-resistant inks that maintain color vibrancy for months.', sortOrder: 2 },
    ],
  })

  // 9. Large Format Poster
  const poster = await createProduct({
    name: 'Large Format Poster',
    slug: 'large-format-poster',
    description: 'Turn heads with our high-quality large format posters. Printed on premium photo paper, canvas, or vinyl using vibrant, fade-resistant inks. Ideal for movie posters, event promotions, retail displays, and artistic prints. Available in various sizes from A3 to custom large formats.',
    shortDesc: 'High-quality large format posters with vibrant, fade-resistant printing.',
    categorySlug: 'posters',
    basePrice: 399,
    comparePrice: 599,
    isFeatured: false,
    templateType: 'standard',
    minQty: 10,
    maxQty: 5000,
    productionDays: 3,
    seoTitle: 'Large Format Posters - Murlidhar Offset',
    seoDesc: 'Order large format posters for advertising and decoration. Starting at ₹399 for 10 posters.',
    variantOptions: [
      { type: 'size', label: 'Poster Size', values: ['A3 (297x420mm)', 'A2 (420x594mm)', 'A1 (594x841mm)', 'A0 (841x1189mm)'], sortOrder: 1 },
      { type: 'material', label: 'Material', values: ['200 GSM Glossy Paper', 'Photo Paper', 'Canvas', 'Vinyl'], sortOrder: 2 },
    ],
    quantityPrices: [
      { minQty: 10, maxQty: 24, pricePer: 39.9, discount: 0 },
      { minQty: 25, maxQty: 49, pricePer: 35.96, discount: 8 },
      { minQty: 50, maxQty: 99, pricePer: 31.98, discount: 15 },
      { minQty: 100, maxQty: 5000, pricePer: 27.99, discount: 25 },
    ],
    variants: [
      { name: 'A3 + 200 GSM Glossy Paper', sku: 'PS-A3-200', price: 399, attrs: { size: 'A3 (297x420mm)', material: '200 GSM Glossy Paper' } },
      { name: 'A2 + Photo Paper', sku: 'PS-A2-PHOTO', price: 699, attrs: { size: 'A2 (420x594mm)', material: 'Photo Paper' } },
      { name: 'A1 + Canvas', sku: 'PS-A1-CANVAS', price: 1299, attrs: { size: 'A1 (594x841mm)', material: 'Canvas' } },
      { name: 'A0 + Vinyl', sku: 'PS-A0-VINYL', price: 1999, attrs: { size: 'A0 (841x1189mm)', material: 'Vinyl' } },
    ],
    faqs: [
      { question: 'What material should I choose for outdoor posters?', answer: 'For outdoor use, we recommend vinyl material as it is waterproof and highly durable. For indoor displays, photo paper or glossy paper gives the best color reproduction and detail.', sortOrder: 1 },
      { question: 'What resolution should my poster design be?', answer: 'For best results, your design should be at least 150 DPI at the final print size. For large format prints, 300 DPI is ideal for close viewing, while 150 DPI is sufficient for posters viewed from a distance.', sortOrder: 2 },
    ],
  })

  // 10. Custom Packaging Box
  const packagingBox = await createProduct({
    name: 'Custom Packaging Box',
    slug: 'custom-packaging-box',
    description: 'Elevate your product presentation with custom packaging boxes. Whether you need rigid boxes, folding cartons, or corrugated boxes, we offer a wide range of customization options. Features include custom shapes, window cutouts, embossing, foil stamping, and premium finishes.',
    shortDesc: 'Custom packaging boxes with premium finishes and full customization.',
    categorySlug: 'packaging',
    basePrice: 1999,
    comparePrice: 2999,
    isFeatured: true,
    templateType: 'standard',
    minQty: 50,
    maxQty: 10000,
    productionDays: 7,
    seoTitle: 'Custom Packaging Boxes - Murlidhar Offset',
    seoDesc: 'Order custom packaging boxes with premium finishes. Starting at ₹1999 for 50 boxes.',
    variantOptions: [
      { type: 'type', label: 'Box Type', values: ['Rigid Box', 'Folding Carton', 'Corrugated Box', 'Drawer Box'], sortOrder: 1 },
      { type: 'finish', label: 'Finish', values: ['Matte Lamination', 'Gloss Lamination', 'Spot UV', 'Embossing', 'Foil Stamping'], sortOrder: 2 },
      { type: 'size', label: 'Box Size', values: ['Small (10x10x5cm)', 'Medium (20x15x8cm)', 'Large (30x25x12cm)', 'Custom Size'], sortOrder: 3 },
    ],
    quantityPrices: [
      { minQty: 50, maxQty: 99, pricePer: 39.98, discount: 0 },
      { minQty: 100, maxQty: 249, pricePer: 34.99, discount: 10 },
      { minQty: 250, maxQty: 10000, pricePer: 29.996, discount: 20 },
    ],
    variants: [
      { name: 'Rigid Box + Matte Lamination + Medium', sku: 'PK-RB-ML-MED', price: 1999, attrs: { type: 'Rigid Box', finish: 'Matte Lamination', size: 'Medium (20x15x8cm)' } },
      { name: 'Folding Carton + Spot UV + Small', sku: 'PK-FC-SPUV-SML', price: 1499, attrs: { type: 'Folding Carton', finish: 'Spot UV', size: 'Small (10x10x5cm)' } },
      { name: 'Drawer Box + Foil Stamping + Medium', sku: 'PK-DB-FS-MED', price: 2499, attrs: { type: 'Drawer Box', finish: 'Foil Stamping', size: 'Medium (20x15x8cm)' } },
      { name: 'Corrugated Box + Gloss Lamination + Large', sku: 'PK-CB-GL-LRG', price: 1799, attrs: { type: 'Corrugated Box', finish: 'Gloss Lamination', size: 'Large (30x25x12cm)' } },
    ],
    faqs: [
      { question: 'What is the minimum order quantity for custom packaging?', answer: 'The minimum order quantity is 50 boxes. However, for complex designs or special finishes, we may recommend a higher minimum to ensure cost-effectiveness.', sortOrder: 1 },
      { question: 'Can I get a sample before placing a bulk order?', answer: 'Yes, we can provide a sample box for design and quality approval before you place a bulk order. Sample charges may apply, which are adjusted against your bulk order.', sortOrder: 2 },
      { question: 'What file format should I provide for the packaging design?', answer: 'We accept AI, CDR, PDF, and PSD files. Please ensure all fonts are outlined and images are at least 300 DPI. Our team can also help with the design if needed.', sortOrder: 3 },
    ],
  })

  // 11. Xerox & Lamination Service
  const xeroxLamination = await createProduct({
    name: 'Xerox & Lamination Service',
    slug: 'xerox-lamination-service',
    description: 'Professional xerox copying and lamination services for all your document needs. From simple black & white copies to color printing and thick lamination, we handle it all. Quick turnaround and competitive pricing for both small and bulk orders.',
    shortDesc: 'Professional xerox copying and lamination services at competitive prices.',
    categorySlug: 'xerox-lamination',
    basePrice: 2,
    comparePrice: 5,
    isFeatured: false,
    templateType: 'standard',
    minQty: 1,
    maxQty: 10000,
    productionDays: 1,
    seoTitle: 'Xerox & Lamination Services - Murlidhar Offset',
    seoDesc: 'Professional xerox and lamination services. Starting at ₹2 per page.',
    variantOptions: [
      { type: 'service', label: 'Service Type', values: ['B&W Xerox', 'Color Xerox', 'Lamination - Thin (75 micron)', 'Lamination - Thick (125 micron)'], sortOrder: 1 },
      { type: 'size', label: 'Paper Size', values: ['A4', 'A3', 'Legal', 'Letter'], sortOrder: 2 },
    ],
    quantityPrices: [
      { minQty: 1, maxQty: 49, pricePer: 2, discount: 0 },
      { minQty: 50, maxQty: 99, pricePer: 1.5, discount: 25 },
      { minQty: 100, maxQty: 10000, pricePer: 1.2, discount: 40 },
    ],
    variants: [
      { name: 'B&W Xerox + A4', sku: 'XL-BW-A4', price: 2, attrs: { service: 'B&W Xerox', size: 'A4' } },
      { name: 'Color Xerox + A4', sku: 'XL-CLR-A4', price: 10, attrs: { service: 'Color Xerox', size: 'A4' } },
      { name: 'Lamination - Thin + A4', sku: 'XL-LAM-T-A4', price: 20, attrs: { service: 'Lamination - Thin (75 micron)', size: 'A4' } },
      { name: 'Lamination - Thick + A4', sku: 'XL-LAM-TH-A4', price: 30, attrs: { service: 'Lamination - Thick (125 micron)', size: 'A4' } },
    ],
    faqs: [
      { question: 'What types of documents can you laminate?', answer: 'We can laminate almost any flat document including certificates, ID cards, photographs, posters, menus, and more. Maximum width is 32 inches for roll lamination.', sortOrder: 1 },
      { question: 'What is the difference between thin and thick lamination?', answer: 'Thin lamination (75 micron) is lightweight and flexible, suitable for documents that need to be filed or handled regularly. Thick lamination (125 micron) is rigid and durable, ideal for items that need extra protection like ID cards and display materials.', sortOrder: 2 },
    ],
  })

  // 12. Custom Print Job
  const customPrint = await createProduct({
    name: 'Custom Print Job',
    slug: 'custom-print-job',
    description: 'Have a unique printing requirement? Our custom print job service covers everything from specialty items to large-format printing. Whether it is custom-shaped prints, unusual materials, or unique finishing, our team can handle it. Contact us with your specifications for a custom quote.',
    shortDesc: 'Custom printing solutions for unique and specialized requirements.',
    categorySlug: 'custom-printing',
    basePrice: 999,
    comparePrice: 1499,
    isFeatured: false,
    templateType: 'standard',
    minQty: 1,
    maxQty: 1000,
    productionDays: 7,
    seoTitle: 'Custom Print Jobs - Specialty Printing - Murlidhar Offset',
    seoDesc: 'Custom printing solutions for unique requirements. Contact us for a personalized quote.',
    variantOptions: [
      { type: 'print_type', label: 'Print Type', values: ['Offset Printing', 'Digital Printing', 'Screen Printing', 'UV Printing'], sortOrder: 1 },
      { type: 'material', label: 'Material', values: ['Paper', 'Cardboard', 'Plastic', 'Fabric', 'Metal', 'Wood'], sortOrder: 2 },
      { type: 'finish', label: 'Finish', values: ['Standard', 'Lamination', 'Embossing', 'Foil', 'Varnish'], sortOrder: 3 },
    ],
    quantityPrices: [
      { minQty: 1, maxQty: 9, pricePer: 999, discount: 0 },
      { minQty: 10, maxQty: 49, pricePer: 799.9, discount: 15 },
      { minQty: 50, maxQty: 1000, pricePer: 699.98, discount: 25 },
    ],
    variants: [
      { name: 'Offset Printing + Paper + Standard', sku: 'CP-OFF-PAPER-STD', price: 999, attrs: { print_type: 'Offset Printing', material: 'Paper', finish: 'Standard' } },
      { name: 'Digital Printing + Cardboard + Lamination', sku: 'CP-DIG-CARD-LAM', price: 1499, attrs: { print_type: 'Digital Printing', material: 'Cardboard', finish: 'Lamination' } },
      { name: 'Screen Printing + Fabric + Standard', sku: 'CP-SCR-FABRIC-STD', price: 1999, attrs: { print_type: 'Screen Printing', material: 'Fabric', finish: 'Standard' } },
      { name: 'UV Printing + Metal + Foil', sku: 'CP-UV-METAL-FOIL', price: 2999, attrs: { print_type: 'UV Printing', material: 'Metal', finish: 'Foil' } },
    ],
    faqs: [
      { question: 'How do I get a quote for a custom print job?', answer: 'Simply share your requirements including the item type, quantity, material, size, and any special finishes needed. Our team will review and provide a detailed quote within 24 hours.', sortOrder: 1 },
      { question: 'What is the turnaround time for custom print jobs?', answer: 'Turnaround time varies based on complexity, typically 5-10 business days. Rush orders may be available at an additional charge. We will provide an estimated timeline with your quote.', sortOrder: 2 },
      { question: 'Can you print on unusual materials?', answer: 'Yes! We can print on a wide range of materials including plastic, fabric, metal, wood, acrylic, and more. Contact us with your specific material requirement and we will advise on the best printing method.', sortOrder: 3 },
    ],
  })

  console.log('✅ All 12 products created with variants, options, prices, and FAQs')

  // ==================== COUPONS ====================
  console.log('🎫 Creating coupons...')
  await db.coupon.create({
    data: {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      minOrder: 999,
      maxDiscount: 500,
      usageLimit: 1000,
      usageCount: 0,
      perUserLimit: 1,
      startsAt: new Date('2025-01-01'),
      expiresAt: new Date('2026-12-31'),
      isActive: true,
    },
  })

  await db.coupon.create({
    data: {
      code: 'BULK20',
      type: 'percentage',
      value: 20,
      minOrder: 5000,
      maxDiscount: 2000,
      usageLimit: 500,
      usageCount: 0,
      perUserLimit: 3,
      startsAt: new Date('2025-01-01'),
      expiresAt: new Date('2026-12-31'),
      isActive: true,
    },
  })

  await db.coupon.create({
    data: {
      code: 'PRINT50',
      type: 'flat',
      value: 50,
      minOrder: 499,
      maxDiscount: 50,
      usageLimit: 2000,
      usageCount: 0,
      perUserLimit: 2,
      startsAt: new Date('2025-01-01'),
      expiresAt: new Date('2026-12-31'),
      isActive: true,
    },
  })

  // ==================== ORDER STATUSES ====================
  console.log('📋 Creating order statuses...')
  const orderStatuses = [
    { name: 'Pending', slug: 'pending', color: '#F59E0B', icon: 'Clock', sortOrder: 1, notifyEmail: true, notifySms: true, notifyWhatsapp: false, autoAssign: null },
    { name: 'Payment Received', slug: 'payment-received', color: '#3B82F6', icon: 'CreditCard', sortOrder: 2, notifyEmail: true, notifySms: true, notifyWhatsapp: false, autoAssign: null },
    { name: 'Design Review', slug: 'design-review', color: '#8B5CF6', icon: 'Search', sortOrder: 3, notifyEmail: false, notifySms: false, notifyWhatsapp: false, autoAssign: 'designer' },
    { name: 'Designing', slug: 'designing', color: '#6366F1', icon: 'Palette', sortOrder: 4, notifyEmail: false, notifySms: false, notifyWhatsapp: false, autoAssign: 'designer' },
    { name: 'Design Approved', slug: 'design-approved', color: '#10B981', icon: 'CheckCircle', sortOrder: 5, notifyEmail: true, notifySms: true, notifyWhatsapp: true, autoAssign: null },
    { name: 'Printing', slug: 'printing', color: '#F97316', icon: 'Printer', sortOrder: 6, notifyEmail: false, notifySms: false, notifyWhatsapp: true, autoAssign: null },
    { name: 'Cutting', slug: 'cutting', color: '#EF4444', icon: 'Scissors', sortOrder: 7, notifyEmail: false, notifySms: false, notifyWhatsapp: false, autoAssign: null },
    { name: 'Lamination', slug: 'lamination', color: '#EC4899', icon: 'Layers', sortOrder: 8, notifyEmail: false, notifySms: false, notifyWhatsapp: false, autoAssign: null },
    { name: 'Packing', slug: 'packing', color: '#14B8A6', icon: 'Package', sortOrder: 9, notifyEmail: false, notifySms: false, notifyWhatsapp: false, autoAssign: null },
    { name: 'Ready for Dispatch', slug: 'ready-for-dispatch', color: '#06B6D4', icon: 'Truck', sortOrder: 10, notifyEmail: true, notifySms: true, notifyWhatsapp: true, autoAssign: null },
    { name: 'Shipped', slug: 'shipped', color: '#6366F1', icon: 'Send', sortOrder: 11, notifyEmail: true, notifySms: true, notifyWhatsapp: true, autoAssign: null },
    { name: 'Delivered', slug: 'delivered', color: '#22C55E', icon: 'CheckCircle2', sortOrder: 12, notifyEmail: true, notifySms: true, notifyWhatsapp: true, autoAssign: null },
  ]

  for (const status of orderStatuses) {
    await db.orderStatus.create({ data: status })
  }

  // ==================== CMS CONTENT ====================
  console.log('📝 Creating CMS content...')

  // Hero section
  await db.cmsContent.create({
    data: {
      section: 'hero',
      key: 'main-banner',
      title: 'Where Every Print Tells a Story',
      subtitle: 'Premium offset printing solutions for businesses and individuals. From visiting cards to wedding invitations, we bring your vision to life with exceptional quality.',
      content: 'Discover our wide range of printing services crafted with precision and care. Over 25 years of experience in delivering outstanding print solutions.',
      image: '/images/hero-banner.jpg',
      metadata: JSON.stringify({ ctaText: 'Explore Products', ctaLink: '/products', secondaryCtaText: 'Get Custom Quote', secondaryCtaLink: '/contact' }),
      sortOrder: 1,
      isActive: true,
    },
  })

  // Testimonials
  const testimonials = [
    {
      key: 'testimonial-1',
      title: 'Rajesh Patel',
      subtitle: 'CEO, Patel Industries',
      content: 'Murlidhar Offset has been our go-to printer for over 5 years. Their visiting cards and brochures are always top quality. The team is responsive and delivers on time, every time.',
      metadata: JSON.stringify({ rating: 5 }),
      sortOrder: 1,
    },
    {
      key: 'testimonial-2',
      title: 'Priya Sharma',
      subtitle: 'Wedding Planner',
      content: 'The wedding cards from Murlidhar Offset are simply stunning. My clients are always thrilled with the quality and design. The gold foil work is exceptional!',
      metadata: JSON.stringify({ rating: 5 }),
      sortOrder: 2,
    },
    {
      key: 'testimonial-3',
      title: 'Amit Desai',
      subtitle: 'Marketing Director, TechCorp',
      content: 'We ordered 5000 brochures and flyers for our product launch. The print quality was outstanding and the pricing was very competitive. Highly recommended!',
      metadata: JSON.stringify({ rating: 5 }),
      sortOrder: 3,
    },
    {
      key: 'testimonial-4',
      title: 'Meera Joshi',
      subtitle: 'Owner, Sweet Treats Bakery',
      content: 'The custom packaging boxes from Murlidhar Offset transformed our product presentation. The matte lamination with spot UV finish looks absolutely premium.',
      metadata: JSON.stringify({ rating: 4 }),
      sortOrder: 4,
    },
    {
      key: 'testimonial-5',
      title: 'Vikram Singh',
      subtitle: 'Event Manager',
      content: 'From flex banners to posters, Murlidhar Offset handles all our event printing needs. Quick turnaround, great quality, and always within budget.',
      metadata: JSON.stringify({ rating: 5 }),
      sortOrder: 5,
    },
  ]

  for (const testimonial of testimonials) {
    await db.cmsContent.create({
      data: {
        section: 'testimonials',
        key: testimonial.key,
        title: testimonial.title,
        subtitle: testimonial.subtitle,
        content: testimonial.content,
        metadata: testimonial.metadata,
        sortOrder: testimonial.sortOrder,
        isActive: true,
      },
    })
  }

  // Homepage FAQs
  const homepageFaqs = [
    { key: 'faq-1', title: 'What types of printing services do you offer?', content: 'We offer a comprehensive range of printing services including visiting cards, wedding cards, bill books, letter pads, brochures, flyers, stickers, flex banners, posters, packaging, xerox & lamination, and custom printing solutions.', sortOrder: 1 },
    { key: 'faq-2', title: 'What is the typical turnaround time?', content: 'Turnaround time varies by product. Standard products like visiting cards and flyers take 2-3 business days. Wedding cards and packaging take 5-7 business days. Custom print jobs may take 7-10 business days. Rush orders are available at an additional charge.', sortOrder: 2 },
    { key: 'faq-3', title: 'Do you offer design services?', content: 'Yes! Our experienced design team can create professional designs for any product. Simply share your requirements, brand guidelines, and content, and we will create a design that matches your vision. Design charges vary based on complexity.', sortOrder: 3 },
    { key: 'faq-4', title: 'What file formats do you accept for printing?', content: 'We accept PDF, AI (Adobe Illustrator), CDR (CorelDRAW), PSD (Adobe Photoshop), and high-resolution JPEG/PNG files. For best results, we recommend vector formats (AI, CDR, PDF) with fonts outlined and images at 300 DPI or higher.', sortOrder: 4 },
    { key: 'faq-5', title: 'Do you deliver across India?', content: 'Yes, we deliver across India through our trusted courier partners. Delivery charges vary based on the destination and order weight. We also offer local delivery in Gujarat for orders above ₹999.', sortOrder: 5 },
    { key: 'faq-6', title: 'What payment methods do you accept?', content: 'We accept UPI, credit/debit cards, net banking, and bank transfers. For bulk orders, we also offer EMI options. A 50% advance payment is required for order confirmation, with the balance due before dispatch.', sortOrder: 6 },
  ]

  for (const faq of homepageFaqs) {
    await db.cmsContent.create({
      data: {
        section: 'faq',
        key: faq.key,
        title: faq.title,
        content: faq.content,
        sortOrder: faq.sortOrder,
        isActive: true,
      },
    })
  }

  // Why Choose Us
  const whyChooseUs = [
    { key: 'wcu-1', title: '25+ Years Experience', content: 'Over two decades of expertise in offset and digital printing, delivering exceptional quality consistently.', icon: 'Award', sortOrder: 1 },
    { key: 'wcu-2', title: 'Premium Quality', content: 'We use only the finest materials and state-of-the-art printing technology to ensure every product meets the highest standards.', icon: 'Star', sortOrder: 2 },
    { key: 'wcu-3', title: 'Competitive Pricing', content: 'Get the best value for your money with our transparent pricing and bulk order discounts.', icon: 'DollarSign', sortOrder: 3 },
    { key: 'wcu-4', title: 'Quick Turnaround', content: 'Fast production times without compromising quality. Rush orders available for urgent requirements.', icon: 'Zap', sortOrder: 4 },
    { key: 'wcu-5', title: 'Pan-India Delivery', content: 'Reliable delivery across India with real-time tracking on all shipments.', icon: 'Truck', sortOrder: 5 },
    { key: 'wcu-6', title: 'Expert Design Team', content: 'Our in-house design team helps bring your vision to life with professional, eye-catching designs.', icon: 'Palette', sortOrder: 6 },
  ]

  for (const wcu of whyChooseUs) {
    await db.cmsContent.create({
      data: {
        section: 'why-choose-us',
        key: wcu.key,
        title: wcu.title,
        content: wcu.content,
        metadata: JSON.stringify({ icon: wcu.icon }),
        sortOrder: wcu.sortOrder,
        isActive: true,
      },
    })
  }

  // ==================== SITE SETTINGS ====================
  console.log('⚙️ Creating site settings...')
  const siteSettings = [
    { key: 'site_name', value: 'Murlidhar Offset', group: 'general', label: 'Site Name', type: 'text' },
    { key: 'tagline', value: 'Where Every Print Tells a Story', group: 'general', label: 'Tagline', type: 'text' },
    { key: 'phone', value: '+91 98765 43210', group: 'general', label: 'Phone Number', type: 'text' },
    { key: 'email', value: 'info@murlidharoffset.com', group: 'general', label: 'Email Address', type: 'text' },
    { key: 'address', value: 'Gujarat, India', group: 'general', label: 'Address', type: 'text' },
    { key: 'whatsapp', value: '+91 98765 43210', group: 'general', label: 'WhatsApp Number', type: 'text' },
    { key: 'currency', value: 'INR', group: 'general', label: 'Currency', type: 'text' },
    { key: 'gst_percent', value: '18', group: 'general', label: 'GST Percentage', type: 'number' },
    { key: 'free_shipping_min', value: '999', group: 'shipping', label: 'Free Shipping Minimum Order', type: 'number' },
    { key: 'shipping_flat_rate', value: '99', group: 'shipping', label: 'Flat Shipping Rate', type: 'number' },
    { key: 'razorpay_key', value: '', group: 'payment', label: 'Razorpay Key', type: 'text' },
    { key: 'razorpay_secret', value: '', group: 'payment', label: 'Razorpay Secret', type: 'text' },
    { key: 'primary_color', value: '#D97706', group: 'theme', label: 'Primary Color', type: 'color' },
    { key: 'secondary_color', value: '#92400E', group: 'theme', label: 'Secondary Color', type: 'color' },
    { key: 'facebook_url', value: '', group: 'social', label: 'Facebook URL', type: 'text' },
    { key: 'instagram_url', value: '', group: 'social', label: 'Instagram URL', type: 'text' },
    { key: 'twitter_url', value: '', group: 'social', label: 'Twitter URL', type: 'text' },
  ]

  for (const setting of siteSettings) {
    await db.siteSetting.create({ data: setting })
  }

  // ==================== SAMPLE ORDERS ====================
  console.log('🛒 Creating sample orders...')

  // Create addresses for customers
  const address1 = await db.address.create({
    data: {
      userId: customer1.id,
      name: 'Rajesh Patel',
      phone: '+91 99887 76655',
      address1: '12, Industrial Estate',
      address2: 'Near Railway Station',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001',
      country: 'India',
      isDefault: true,
      addressType: 'office',
    },
  })

  const address2 = await db.address.create({
    data: {
      userId: customer2.id,
      name: 'Priya Sharma',
      phone: '+91 88776 65544',
      address1: '45, Satellite Road',
      address2: 'Opp. City Mall',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395003',
      country: 'India',
      isDefault: true,
      addressType: 'home',
    },
  })

  const address3 = await db.address.create({
    data: {
      userId: customer3.id,
      name: 'Amit Desai',
      phone: '+91 77665 54433',
      address1: '78, MG Road',
      address2: 'Above Bank of Baroda',
      city: 'Vadodara',
      state: 'Gujarat',
      pincode: '390001',
      country: 'India',
      isDefault: true,
      addressType: 'office',
    },
  })

  // Get some variant IDs for order items
  const visitingCardVariants = await db.productVariant.findMany({ where: { productId: visitingCard.id } })
  const weddingCardVariants = await db.productVariant.findMany({ where: { productId: weddingCard.id } })
  const brochureVariants = await db.productVariant.findMany({ where: { productId: brochure.id } })
  const flyerVariants = await db.productVariant.findMany({ where: { productId: flyer.id } })
  const stickerVariants = await db.productVariant.findMany({ where: { productId: sticker.id } })
  const packagingVariants = await db.productVariant.findMany({ where: { productId: packagingBox.id } })

  // Order 1: Delivered order
  const order1 = await db.order.create({
    data: {
      orderNumber: 'MO-2025-001',
      userId: customer1.id,
      status: 'delivered',
      subtotal: 2598,
      gstAmount: 467.64,
      gstPercent: 18,
      shippingCost: 0,
      discountAmount: 259.8,
      totalAmount: 2805.84,
      couponId: null,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      paymentId: 'pay_Rs1example001',
      shippingAddress: JSON.stringify({ name: 'Rajesh Patel', phone: '+91 99887 76655', address1: '12, Industrial Estate', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' }),
      billingAddress: JSON.stringify({ name: 'Rajesh Patel', phone: '+91 99887 76655', address1: '12, Industrial Estate', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' }),
      trackingNumber: 'DTDC123456789',
      trackingUrl: 'https://track.dtdc.com/DTDC123456789',
      estimatedDelivery: new Date('2025-02-15'),
      deliveredAt: new Date('2025-02-14'),
    },
  })

  await db.orderItem.createMany({
    data: [
      { orderId: order1.id, productId: visitingCard.id, variantId: visitingCardVariants[0]?.id, name: 'Premium Matte Visiting Card', quantity: 500, price: 1.598, total: 799, attrs: JSON.stringify({ size: 'Standard 90x54mm', material: '300 GSM Matte', finish: 'Matte' }) },
      { orderId: order1.id, productId: brochure.id, variantId: brochureVariants[0]?.id, name: 'Premium Brochure', quantity: 250, price: 7.996, total: 1999, attrs: JSON.stringify({ fold: 'Bi-Fold', paper: '170 GSM Gloss', sides: 'Double Side' }) },
    ],
  })

  // Timeline for order 1
  const order1TimelineData = [
    { orderId: order1.id, status: 'pending', note: 'Order placed', createdBy: customer1.id, createdAt: new Date('2025-02-05T10:00:00Z') },
    { orderId: order1.id, status: 'payment-received', note: 'Payment received via Razorpay', createdBy: adminUser.id, createdAt: new Date('2025-02-05T10:05:00Z') },
    { orderId: order1.id, status: 'design-review', note: 'Uploaded design under review', createdBy: designerUser.id, createdAt: new Date('2025-02-05T14:00:00Z') },
    { orderId: order1.id, status: 'design-approved', note: 'Design approved by customer', createdBy: customer1.id, createdAt: new Date('2025-02-06T09:00:00Z') },
    { orderId: order1.id, status: 'printing', note: 'Sent to press', createdBy: adminUser.id, createdAt: new Date('2025-02-06T11:00:00Z') },
    { orderId: order1.id, status: 'cutting', note: 'Cutting completed', createdBy: adminUser.id, createdAt: new Date('2025-02-07T16:00:00Z') },
    { orderId: order1.id, status: 'packing', note: 'Packed and ready', createdBy: adminUser.id, createdAt: new Date('2025-02-08T10:00:00Z') },
    { orderId: order1.id, status: 'shipped', note: 'Shipped via DTDC', createdBy: adminUser.id, createdAt: new Date('2025-02-08T14:00:00Z') },
    { orderId: order1.id, status: 'delivered', note: 'Delivered successfully', createdBy: null, createdAt: new Date('2025-02-14T11:00:00Z') },
  ]
  for (const tl of order1TimelineData) {
    await db.orderTimeline.create({ data: tl })
  }

  // Order 2: In printing
  const order2 = await db.order.create({
    data: {
      orderNumber: 'MO-2025-002',
      userId: customer2.id,
      status: 'printing',
      subtotal: 4497,
      gstAmount: 809.46,
      gstPercent: 18,
      shippingCost: 99,
      discountAmount: 0,
      totalAmount: 5405.46,
      couponId: null,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      paymentId: 'pay_Rs1example002',
      shippingAddress: JSON.stringify({ name: 'Priya Sharma', phone: '+91 88776 65544', address1: '45, Satellite Road', city: 'Surat', state: 'Gujarat', pincode: '395003' }),
      billingAddress: JSON.stringify({ name: 'Priya Sharma', phone: '+91 88776 65544', address1: '45, Satellite Road', city: 'Surat', state: 'Gujarat', pincode: '395003' }),
      estimatedDelivery: new Date('2025-03-10'),
    },
  })

  await db.orderItem.createMany({
    data: [
      { orderId: order2.id, productId: weddingCard.id, variantId: weddingCardVariants[0]?.id, name: 'Royal Wedding Card', quantity: 100, price: 24.99, total: 2499, attrs: JSON.stringify({ style: 'Single Card', material: 'Premium Cardstock', finish: 'Gold Foil' }) },
      { orderId: order2.id, productId: sticker.id, variantId: stickerVariants[0]?.id, name: 'Custom Stickers', quantity: 500, price: 2.398, total: 1199, attrs: JSON.stringify({ type: 'Die-Cut (Custom Shape)', material: 'Glossy Vinyl', size: 'Medium (3x3 inch)' }) },
      { orderId: order2.id, productId: flyer.id, variantId: flyerVariants[0]?.id, name: 'Marketing Flyer', quantity: 250, price: 4.796, total: 1199, attrs: JSON.stringify({ size: 'A5 (148x210mm)', paper: '130 GSM Gloss', sides: 'Single Side' }) },
    ],
  })

  // Order 2 timeline
  const order2TimelineData = [
    { orderId: order2.id, status: 'pending', note: 'Order placed', createdBy: customer2.id, createdAt: new Date('2025-02-25T11:00:00Z') },
    { orderId: order2.id, status: 'payment-received', note: 'Payment received', createdBy: adminUser.id, createdAt: new Date('2025-02-25T11:10:00Z') },
    { orderId: order2.id, status: 'design-review', note: 'Design files uploaded for review', createdBy: customer2.id, createdAt: new Date('2025-02-25T15:00:00Z') },
    { orderId: order2.id, status: 'designing', note: 'Adjusting design as per requirements', createdBy: designerUser.id, createdAt: new Date('2025-02-26T10:00:00Z') },
    { orderId: order2.id, status: 'design-approved', note: 'Final design approved', createdBy: customer2.id, createdAt: new Date('2025-02-27T09:00:00Z') },
    { orderId: order2.id, status: 'printing', note: 'Currently in printing', createdBy: adminUser.id, createdAt: new Date('2025-02-27T14:00:00Z') },
  ]
  for (const tl of order2TimelineData) {
    await db.orderTimeline.create({ data: tl })
  }

  // Order 3: Pending payment
  const order3 = await db.order.create({
    data: {
      orderNumber: 'MO-2025-003',
      userId: customer3.id,
      status: 'pending',
      subtotal: 4297,
      gstAmount: 773.46,
      gstPercent: 18,
      shippingCost: 99,
      discountAmount: 429.7,
      totalAmount: 4740.76,
      couponId: null,
      paymentMethod: null,
      paymentStatus: 'pending',
      shippingAddress: JSON.stringify({ name: 'Amit Desai', phone: '+91 77665 54433', address1: '78, MG Road', city: 'Vadodara', state: 'Gujarat', pincode: '390001' }),
      billingAddress: JSON.stringify({ name: 'Amit Desai', phone: '+91 77665 54433', address1: '78, MG Road', city: 'Vadodara', state: 'Gujarat', pincode: '390001' }),
      notes: 'Need urgent delivery if possible',
    },
  })

  await db.orderItem.createMany({
    data: [
      { orderId: order3.id, productId: packagingBox.id, variantId: packagingVariants[0]?.id, name: 'Custom Packaging Box', quantity: 100, price: 34.99, total: 3499, attrs: JSON.stringify({ type: 'Rigid Box', finish: 'Matte Lamination', size: 'Medium (20x15x8cm)' }) },
      { orderId: order3.id, productId: visitingCard.id, variantId: visitingCardVariants[1]?.id, name: 'Premium Matte Visiting Card', quantity: 500, price: 1.598, total: 799, attrs: JSON.stringify({ size: 'Standard 90x54mm', material: '350 GSM Gloss', finish: 'Gloss' }) },
    ],
  })

  await db.orderTimeline.create({
    data: { orderId: order3.id, status: 'pending', note: 'Order placed, awaiting payment', createdBy: customer3.id },
  })

  // Order 4: Shipped
  const order4 = await db.order.create({
    data: {
      orderNumber: 'MO-2025-004',
      userId: customer1.id,
      status: 'shipped',
      subtotal: 799,
      gstAmount: 143.82,
      gstPercent: 18,
      shippingCost: 0,
      discountAmount: 50,
      totalAmount: 892.82,
      couponId: null,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      paymentId: 'pay_Rs1example004',
      shippingAddress: JSON.stringify({ name: 'Rajesh Patel', phone: '+91 99887 76655', address1: '12, Industrial Estate', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' }),
      trackingNumber: 'BLUEDART987654',
      trackingUrl: 'https://track.bluedart.com/BLUEDART987654',
      estimatedDelivery: new Date('2025-03-05'),
    },
  })

  await db.orderItem.create({
    data: {
      orderId: order4.id,
      productId: visitingCard.id,
      variantId: visitingCardVariants[4]?.id,
      name: 'Premium Matte Visiting Card',
      quantity: 500,
      price: 1.598,
      total: 799,
      attrs: JSON.stringify({ size: 'US Standard 89x51mm', material: '350 GSM Gloss', finish: 'Spot UV' }),
    },
  })

  const order4TimelineData = [
    { orderId: order4.id, status: 'pending', note: 'Order placed', createdBy: customer1.id, createdAt: new Date('2025-02-26T09:00:00Z') },
    { orderId: order4.id, status: 'payment-received', note: 'Payment received', createdBy: adminUser.id, createdAt: new Date('2025-02-26T09:10:00Z') },
    { orderId: order4.id, status: 'design-approved', note: 'Design approved - using existing design', createdBy: customer1.id, createdAt: new Date('2025-02-26T10:00:00Z') },
    { orderId: order4.id, status: 'printing', note: 'Printing completed', createdBy: adminUser.id, createdAt: new Date('2025-02-27T16:00:00Z') },
    { orderId: order4.id, status: 'packing', note: 'Packed', createdBy: adminUser.id, createdAt: new Date('2025-02-28T10:00:00Z') },
    { orderId: order4.id, status: 'shipped', note: 'Shipped via BlueDart', createdBy: adminUser.id, createdAt: new Date('2025-02-28T14:00:00Z') },
  ]
  for (const tl of order4TimelineData) {
    await db.orderTimeline.create({ data: tl })
  }

  // Order 5: Design in progress
  const order5 = await db.order.create({
    data: {
      orderNumber: 'MO-2025-005',
      userId: customer2.id,
      status: 'designing',
      subtotal: 3998,
      gstAmount: 719.64,
      gstPercent: 18,
      shippingCost: 0,
      discountAmount: 0,
      totalAmount: 4717.64,
      couponId: null,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      paymentId: 'pay_Rs1example005',
      shippingAddress: JSON.stringify({ name: 'Priya Sharma', phone: '+91 88776 65544', address1: '45, Satellite Road', city: 'Surat', state: 'Gujarat', pincode: '395003' }),
    },
  })

  await db.orderItem.createMany({
    data: [
      { orderId: order5.id, productId: weddingCard.id, variantId: weddingCardVariants[2]?.id, name: 'Royal Wedding Card', quantity: 200, price: 19.995, total: 3999, attrs: JSON.stringify({ style: 'Box Card', material: 'Handmade Paper', finish: 'Embossed' }) },
    ],
  })

  const order5TimelineData = [
    { orderId: order5.id, status: 'pending', note: 'Order placed', createdBy: customer2.id, createdAt: new Date('2025-02-27T13:00:00Z') },
    { orderId: order5.id, status: 'payment-received', note: 'Payment received', createdBy: adminUser.id, createdAt: new Date('2025-02-27T13:15:00Z') },
    { orderId: order5.id, status: 'designing', note: 'Working on custom wedding card design', createdBy: designerUser.id, createdAt: new Date('2025-02-28T10:00:00Z') },
  ]
  for (const tl of order5TimelineData) {
    await db.orderTimeline.create({ data: tl })
  }

  // Internal notes for some orders
  await db.orderNote.createMany({
    data: [
      { orderId: order2.id, note: 'Customer requested gold foil on inner page too - check with production', isInternal: true, createdBy: designerUser.id },
      { orderId: order3.id, note: 'Customer wants urgent delivery - expedite if possible after payment', isInternal: true, createdBy: adminUser.id },
      { orderId: order5.id, note: 'Custom design requires 2 extra days - informed customer', isInternal: true, createdBy: designerUser.id },
    ],
  })

  // ==================== SAMPLE REVIEWS ====================
  console.log('⭐ Creating sample reviews...')
  const reviewsData = [
    { userId: customer1.id, productId: visitingCard.id, rating: 5, title: 'Excellent Quality Cards', comment: 'The visiting cards turned out amazing! The matte finish on 300 GSM paper feels premium. Will definitely order again for my entire team.' },
    { userId: customer2.id, productId: weddingCard.id, rating: 5, title: 'Beautiful Wedding Cards', comment: 'Our wedding cards were absolutely stunning. The gold foil detailing was perfect and we received so many compliments from guests. The team was very patient with our design changes.' },
    { userId: customer3.id, productId: brochure.id, rating: 4, title: 'Great Brochures for Trade Show', comment: 'The bi-fold brochures were high quality and the colors were vibrant. Delivery was on time. Only suggestion would be to offer more paper weight options.' },
    { userId: customer1.id, productId: sticker.id, rating: 5, title: 'Perfect Product Labels', comment: 'The die-cut stickers are exactly what we needed for our product packaging. Waterproof and the print quality is sharp. Very satisfied!' },
    { userId: customer2.id, productId: flyer.id, rating: 4, title: 'Good Quality Flyers', comment: 'Printed 500 flyers for our store promotion. The glossy finish looks great and the colors are accurate. Good value for money.' },
    { userId: customer3.id, productId: packagingBox.id, rating: 5, title: 'Premium Packaging', comment: 'The custom packaging boxes with matte lamination and spot UV are absolutely gorgeous. They have elevated our brand presentation significantly. Worth every penny!' },
  ]

  for (const review of reviewsData) {
    await db.review.create({ data: review })
  }

  // ==================== FINAL STATS ====================
  console.log('\n📊 Seed Data Summary:')
  console.log(`  👤 Users: ${await db.user.count()}`)
  console.log(`  📁 Categories: ${await db.category.count()}`)
  console.log(`  📦 Products: ${await db.product.count()}`)
  console.log(`  🎨 Product Variants: ${await db.productVariant.count()}`)
  console.log(`  🔧 Variant Options: ${await db.variantOption.count()}`)
  console.log(`  💰 Quantity Prices: ${await db.quantityPrice.count()}`)
  console.log(`  ❓ Product FAQs: ${await db.productFAQ.count()}`)
  console.log(`  🎫 Coupons: ${await db.coupon.count()}`)
  console.log(`  📋 Order Statuses: ${await db.orderStatus.count()}`)
  console.log(`  📝 CMS Content: ${await db.cmsContent.count()}`)
  console.log(`  ⚙️ Site Settings: ${await db.siteSetting.count()}`)
  console.log(`  🛒 Orders: ${await db.order.count()}`)
  console.log(`  📦 Order Items: ${await db.orderItem.count()}`)
  console.log(`  📋 Order Timelines: ${await db.orderTimeline.count()}`)
  console.log(`  ⭐ Reviews: ${await db.review.count()}`)
  console.log(`  📍 Addresses: ${await db.address.count()}`)

  console.log('\n✅ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
