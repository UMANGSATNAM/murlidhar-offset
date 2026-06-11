import { db } from '../src/lib/db';

const imageMap: Record<string, string[]> = {
  'visiting-cards': ['/products/business-cards.png'],
  'wedding-cards': ['/products/wedding-cards.png'],
  'bill-books': ['/products/bill-books.png'],
  'letter-pads': ['/products/letter-pads.png'],
  'brochures': ['/products/brochures.png'],
  'flyers': ['/products/flyers.png'],
  'stickers-labels': ['/products/stickers.png'],
  'flex-banners': ['/products/flex-banners.png'],
  'posters': ['/products/posters.png'],
  'packaging': ['/products/packaging.png'],
  'xerox-lamination': ['/products/xerox-lamination.png'],
  'custom-printing': ['/products/custom-printing.png'],
};

async function main() {
  const categories = await db.category.findMany();
  
  for (const cat of categories) {
    const images = imageMap[cat.slug];
    if (!images) continue;
    
    const products = await db.product.findMany({ where: { categoryId: cat.id } });
    for (const product of products) {
      await db.product.update({
        where: { id: product.id },
        data: { images: JSON.stringify(images) },
      });
      console.log(`Updated ${product.name} with images: ${images.join(', ')}`);
    }
  }
  
  console.log('Done!');
}

main().catch(console.error);
