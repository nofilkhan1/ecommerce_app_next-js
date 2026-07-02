import { NextRequest, NextResponse } from 'next/server';
import { initDb, execute, queryAll } from '@/lib/db';
import { verifyApiKey } from '@/lib/auth';

const SAMPLE_PRODUCTS = [
  { name: 'Printed Summer Lawn', description: 'Elegant printed lawn suit perfect for summer days. Premium quality fabric with intricate patterns.', price: 4599, category: 'SUMMER COLLECTION', image_url: '/images/products/product-1.jpg', stock: 25 },
  { name: 'Embroidered Chiffon Dupatta', description: 'Beautifully embroidered chiffon dupatta with hand-finished edges.', price: 2999, category: 'SUMMER COLLECTION', image_url: '/images/products/product-2.jpg', stock: 40 },
  { name: 'Luxury Velvet Formals', description: 'Rich velvet formal ensemble with gold thread embroidery.', price: 8999, category: 'FORMALS', image_url: '/images/products/product-3.jpg', stock: 15 },
  { name: 'Cotton Co-ord Set', description: 'Matching two-piece co-ord set in breathable cotton. Modern relaxed fit.', price: 5499, category: 'CO-ORDS', image_url: '/images/products/product-4.jpg', stock: 30 },
  { name: 'Silk Unstitched Collection', description: 'Premium unstitched silk fabric with digital print. Customizable tailoring.', price: 6799, category: 'UNSTITCHED', image_url: '/images/products/product-5.jpg', stock: 20 },
  { name: 'Ready to Wear Kurta', description: 'Classic straight-cut kurta in premium cotton. Available in multiple colors.', price: 3499, category: 'READY TO WEAR', image_url: '/images/products/product-6.jpg', stock: 50 },
  { name: 'Summer Floral Maxi', description: 'Flowing floral maxi dress for casual summer outings. Lightweight and comfortable.', price: 5999, category: 'SUMMER COLLECTION', image_url: '/images/products/product-7.jpg', stock: 18 },
  { name: 'Pearl & Gold Accessories Set', description: 'Elegant pearl and gold-plated jewelry set. Necklace, earrings, and bracelet.', price: 4299, category: 'ACCESSORIES', image_url: '/images/products/product-8.jpg', stock: 35 },
  { name: 'Men\'s Formal Shalwar Kameez', description: 'Traditional shalwar kameez in premium Pakistani cotton. Perfect for formal occasions.', price: 4999, category: 'FORMALS', image_url: '/images/products/product-9.jpg', stock: 22 },
  { name: 'Linen Summer Co-ords', description: 'Premium linen co-ord set for men. Breathable fabric with modern design.', price: 6299, category: 'CO-ORDS', image_url: '/images/products/product-10.jpg', stock: 12 },
  { name: 'Embroidered Net Suit', description: 'Delicate net suit with heavy embroidery on neckline and borders.', price: 7499, category: 'SUMMER COLLECTION', image_url: '/images/products/product-11.jpg', stock: 8 },
  { name: 'Casual Cotton Trousers', description: 'Comfortable cotton trousers with elastic waistband. Perfect daily wear.', price: 1999, category: 'READY TO WEAR', image_url: '/images/products/product-12.jpg', stock: 60 },
  { name: 'Designer Clutch Bag', description: 'Stylish designer clutch with metallic finish. Perfect for evening events.', price: 3299, category: 'ACCESSORIES', image_url: '/images/products/product-13.jpg', stock: 28 },
  { name: 'Unstitched Cotton Khaddar', description: 'Premium cotton khaddar fabric for winter tailoring. Soft and warm.', price: 3999, category: 'UNSTITCHED', image_url: '/images/products/product-14.jpg', stock: 45 },
  { name: 'Silk Formal Dress', description: 'Luxurious silk formal dress with intricate handwork. Statement piece for weddings.', price: 12999, category: 'FORMALS', image_url: '/images/products/product-15.jpg', stock: 5 },
  { name: 'Printed Lawn Dupatta', description: 'Vibrant printed lawn dupatta to complement any suit. Lightweight and versatile.', price: 1499, category: 'SUMMER COLLECTION', image_url: '/images/products/product-16.jpg', stock: 55 },
  { name: 'Men\'s Classic Waistcoat', description: 'Tailored waistcoat in premium fabric. Pairs perfectly with shalwar kameez.', price: 2799, category: 'READY TO WEAR', image_url: '/images/products/product-17.jpg', stock: 30 },
  { name: 'Woven Scarf Collection', description: 'Hand-woven silk and wool blend scarf. Luxurious texture and warmth.', price: 1899, category: 'ACCESSORIES', image_url: '/images/products/product-18.jpg', stock: 42 },
  { name: 'Summer Chiffon Co-ords', description: 'Elegant two-piece chiffon ensemble. Lightweight and perfect for summer events.', price: 7299, category: 'CO-ORDS', image_url: '/images/products/product-19.jpg', stock: 10 },
  { name: 'Pret a Porter Collection', description: 'Ready-to-wear western-inspired collection. Modern cuts with eastern elegance.', price: 5699, category: 'READY TO WEAR', image_url: '/images/products/product-20.jpg', stock: 25 },
  { name: 'Formal Sharara Set', description: 'Gorgeous sharara set with mirror work embroidery. Perfect for festive occasions.', price: 9499, category: 'FORMALS', image_url: '/images/products/product-21.jpg', stock: 7 },
  { name: 'Kids Summer Collection', description: 'Comfortable and colorful summer wear for kids. Soft fabrics for sensitive skin.', price: 2499, category: 'SUMMER COLLECTION', image_url: '/images/products/product-22.jpg', stock: 38 },
  { name: 'Embroidered Organza Dupatta', description: 'Sheer organza dupatta with delicate floral embroidery along the borders.', price: 3599, category: 'SUMMER COLLECTION', image_url: '/images/products/product-23.jpg', stock: 15 },
  { name: 'Men\'s Linen Shalwar Kameez', description: 'Breathable linen shalwar kameez for hot summer days. Comfortable and stylish.', price: 4299, category: 'READY TO WEAR', image_url: '/images/products/product-24.jpg', stock: 32 },
  { name: 'Bridal Unstitched Collection', description: 'Premium unstitched bridal fabric with heavy embroidery. Perfect for wedding season.', price: 15999, category: 'UNSTITCHED', image_url: '/images/products/product-25.jpg', stock: 3 },
  { name: 'Rose Gold Earrings', description: 'Stunning rose gold plated earrings with crystal accents. Lightweight and elegant.', price: 2199, category: 'ACCESSORIES', image_url: '/images/products/product-26.jpg', stock: 50 },
  { name: 'Summer Lawn Suit - Pastel', description: 'Soft pastel-toned lawn suit for a refreshing summer look.', price: 4899, category: 'SUMMER COLLECTION', image_url: '/images/products/product-27.jpg', stock: 20 },
  { name: 'Velvet Embroidered Co-ord', description: 'Luxurious velvet co-ord set with gold embroidery. Statement piece for winter events.', price: 8499, category: 'CO-ORDS', image_url: '/images/products/product-28.jpg', stock: 8 },
  { name: 'Premium Cotton Unstitched', description: 'High-thread-count cotton fabric for custom tailoring. Smooth and durable.', price: 3299, category: 'UNSTITCHED', image_url: '/images/products/product-29.jpg', stock: 40 },
  { name: 'Embroidered Formal Gown', description: 'Floor-length formal gown with intricate threadwork. Perfect for special occasions.', price: 11999, category: 'FORMALS', image_url: '/images/products/product-30.jpg', stock: 4 },
  { name: 'Leather Crossbody Bag', description: 'Premium leather crossbody bag with adjustable strap. Practical and stylish.', price: 5999, category: 'ACCESSORIES', image_url: '/images/products/product-31.jpg', stock: 18 },
  { name: 'Kids Ready to Wear', description: 'Adorable ready-to-wear outfits for kids. Easy to put on and comfortable all day.', price: 1999, category: 'READY TO WEAR', image_url: '/images/products/product-32.jpg', stock: 45 },
  { name: 'Summer Beach Co-ords', description: 'Breezy co-ord set perfect for beach vacations. Light and tropical vibes.', price: 4499, category: 'CO-ORDS', image_url: '/images/products/product-33.jpg', stock: 22 },
  { name: 'Silk Embroidered Kurti', description: 'Elegant silk kurti with detailed embroidery. Versatile for casual and formal wear.', price: 5299, category: 'READY TO WEAR', image_url: '/images/products/product-34.jpg', stock: 15 },
  { name: 'Traditional Peshawari Chappal', description: 'Handcrafted leather Peshawari chappal. Classic design with modern comfort.', price: 3799, category: 'ACCESSORIES', image_url: '/images/products/product-35.jpg', stock: 25 },
  { name: 'Geometric Print Lawn', description: 'Modern geometric print on premium lawn fabric. Bold and contemporary design.', price: 4199, category: 'SUMMER COLLECTION', image_url: '/images/products/product-36.jpg', stock: 30 },
  { name: 'Formal Sherwani Set', description: 'Distinguished sherwani set with intricate zardozi work. Perfect for groomsmen.', price: 18999, category: 'FORMALS', image_url: '/images/products/product-37.jpg', stock: 2 },
  { name: 'Casual Linen Pants', description: 'Relaxed-fit linen pants for everyday comfort. Available in earthy tones.', price: 2499, category: 'READY TO WEAR', image_url: '/images/products/product-38.jpg', stock: 35 },
  { name: 'Handmade Potli Bag', description: 'Traditional handmade potli bag with beadwork. Perfect for festive occasions.', price: 1699, category: 'ACCESSORIES', image_url: '/images/products/product-39.jpg', stock: 48 },
  { name: 'Summer Unstitched Volume', description: 'Collection of 3 unstitched summer suits. Mix and match for versatile looks.', price: 11999, category: 'UNSTITCHED', image_url: '/images/products/product-40.jpg', stock: 10 },
  { name: 'Men\'s Formal Waistcoat Suit', description: 'Three-piece formal suit with waistcoat. Tailored for a sharp professional look.', price: 9999, category: 'FORMALS', image_url: '/images/products/product-41.jpg', stock: 12 },
  { name: 'Pastel Co-ord Set', description: 'Soft pastel co-ord set with subtle embroidery. Elegant and understated.', price: 6499, category: 'CO-ORDS', image_url: '/images/products/product-42.jpg', stock: 18 },
  { name: 'Embroidered Kaftan', description: 'Flowing kaftan with all-over embroidery. Luxurious comfort for special events.', price: 7999, category: 'SUMMER COLLECTION', image_url: '/images/products/product-43.jpg', stock: 6 },
  { name: 'Signature Fragrance Set', description: 'Collection of 3 signature fragrances. Long-lasting scents for every occasion.', price: 8999, category: 'ACCESSORIES', image_url: '/images/products/product-44.jpg', stock: 20 },
];

export async function POST(request: NextRequest) {
  try {
    const key = request.headers.get('X-API-Key');
    if (!verifyApiKey(key, 'admin')) {
      return NextResponse.json({ success: false, message: 'Invalid or missing API key' }, { status: 401 });
    }

    await initDb();

    const existing = queryAll('SELECT COUNT(*) as count FROM products');
    const count = (existing[0]?.count as number) ?? 0;

    if (count > 0) {
      execute('DELETE FROM products');
    }

    for (const product of SAMPLE_PRODUCTS) {
      execute(
        `INSERT INTO products (name, description, price, category, image_url, stock)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [product.name, product.description, product.price, product.category, product.image_url, product.stock]
      );
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${SAMPLE_PRODUCTS.length} products successfully`,
    });
  } catch (error) {
    console.error('POST /api/seed error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
