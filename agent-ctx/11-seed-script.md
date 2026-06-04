# Task 11: Seed Script for Murlidhar Offset

## Summary
Created a comprehensive seed script at `/home/z/my-project/prisma/seed.ts` that populates the database with all required sample data.

## Seed Data Summary
- **Users**: 5 (1 super_admin, 1 designer, 3 customers)
- **Categories**: 12 (all specified categories with slugs, descriptions, icons, sort orders)
- **Products**: 12 (one per category with full details)
- **Product Variants**: 48 (multiple variants per product with SKUs, prices, attrs)
- **Variant Options**: 32 (material, finish, size options per product)
- **Quantity Prices**: 42 (tiered pricing per product)
- **Product FAQs**: 30 (2-3 per product)
- **Coupons**: 3 (WELCOME10, BULK20, PRINT50)
- **Order Statuses**: 12 (full workflow from Pending to Delivered)
- **CMS Content**: 18 (hero, 5 testimonials, 6 FAQs, 6 why-choose-us)
- **Site Settings**: 17 (all specified settings + extras for shipping, payment, theme, social)
- **Orders**: 5 (with different statuses: delivered, printing, pending, shipped, designing)
- **Order Items**: 9
- **Order Timelines**: 25 (detailed status transitions)
- **Order Notes**: 3 (internal notes)
- **Reviews**: 6 (positive reviews from different customers)
- **Addresses**: 3 (one per customer)

## Products Created
1. Premium Matte Visiting Card (visiting-cards) - ₹299, 6 variants, 5 qty tiers
2. Royal Wedding Card (wedding-cards) - ₹1499, 4 variants, 4 qty tiers
3. Professional Bill Book (bill-books) - ₹399, 3 variants, 3 qty tiers
4. Corporate Letter Pad (letter-pads) - ₹499, 3 variants, 3 qty tiers
5. Premium Brochure (brochures) - ₹999, 4 variants, 3 qty tiers
6. Marketing Flyer (flyers) - ₹599, 3 variants, 4 qty tiers
7. Custom Stickers (stickers-labels) - ₹199, 5 variants, 4 qty tiers
8. Flex Banner (flex-banners) - ₹249, 4 variants, 3 qty tiers
9. Large Format Poster (posters) - ₹399, 4 variants, 4 qty tiers
10. Custom Packaging Box (packaging) - ₹1999, 4 variants, 3 qty tiers
11. Xerox & Lamination Service (xerox-lamination) - ₹2, 4 variants, 3 qty tiers
12. Custom Print Job (custom-printing) - ₹999, 4 variants, 3 qty tiers

## Admin Credentials
- Email: admin@murlidhar.com
- Password: admin123
- Role: super_admin

## Execution
Script ran successfully with `bunx tsx prisma/seed.ts`. The script is idempotent - it cleans all existing data before seeding.
