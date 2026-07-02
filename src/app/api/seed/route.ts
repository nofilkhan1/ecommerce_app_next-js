import { NextRequest, NextResponse } from 'next/server';
import { initDb, execute, queryAll, queryOne } from '@/lib/db';
import { verifyApiKey } from '@/lib/auth';

interface SeedProduct {
  name: string;
  description: string;
  short_description: string;
  price: number;
  sale_price: number | null;
  category: string;
  gender: string;
  subcategory: string;
  collection: string;
  brand: string;
  sku: string;
  stock: number;
  featured: number;
  status: string;
  tags: string;
  sizes: string;
  colors: string;
  materials: string;
  weight: number;
  image_index: number;
}

const PRODUCTS: SeedProduct[] = [
  // === WOMEN: Summer Collection ===
  { name: 'Printed Summer Lawn', description: 'Elegant printed lawn suit perfect for summer days. Premium quality fabric with intricate patterns that capture the essence of seasonal elegance. Features delicate hand-finished details and a comfortable fit suitable for daily wear.', short_description: 'Premium printed lawn suit for summer', price: 4599, sale_price: 3999, category: 'SUMMER COLLECTION', gender: 'WOMEN', subcategory: 'summer-collection', collection: 'summer-2026', brand: 'J.', sku: 'JJ-WSC-001', stock: 25, featured: 1, status: 'published', tags: 'summer, lawn, printed, women, casual', sizes: 'S,M,L,XL', colors: 'Blue,Green,Pink', materials: 'Lawn Cotton', weight: 0.3, image_index: 1 },
  { name: 'Embroidered Chiffon Dupatta', description: 'Beautifully embroidered chiffon dupatta with hand-finished edges. Lightweight and versatile, perfect for both casual and formal occasions. The delicate embroidery adds a touch of sophistication.', short_description: 'Hand-embroidered chiffon dupatta', price: 2999, sale_price: null, category: 'SUMMER COLLECTION', gender: 'WOMEN', subcategory: 'summer-collection', collection: 'summer-2026', brand: 'J.', sku: 'JJ-WSC-002', stock: 40, featured: 1, status: 'published', tags: 'dupatta, chiffon, embroidered, summer', sizes: 'One Size', colors: 'White,Pastel Pink,Lavender', materials: 'Chiffon', weight: 0.15, image_index: 2 },
  { name: 'Summer Floral Maxi', description: 'Flowing floral maxi dress for casual summer outings. Lightweight and comfortable with a flattering silhouette. Features a vibrant floral print on premium cotton fabric.', short_description: 'Flowing floral maxi dress', price: 5999, sale_price: 4999, category: 'SUMMER COLLECTION', gender: 'WOMEN', subcategory: 'summer-collection', collection: 'signature', brand: 'J.', sku: 'JJ-WSC-003', stock: 18, featured: 1, status: 'published', tags: 'maxi, floral, dress, summer, casual', sizes: 'S,M,L', colors: 'Multi,Pink,Blue', materials: 'Cotton', weight: 0.35, image_index: 7 },
  { name: 'Embroidered Net Suit', description: 'Delicate net suit with heavy embroidery on neckline and borders. Perfect for evening events and formal gatherings. Intricate threadwork and sequin details throughout.', short_description: 'Heavy embroidered net suit', price: 7499, sale_price: 6499, category: 'SUMMER COLLECTION', gender: 'WOMEN', subcategory: 'summer-collection', collection: 'premium', brand: 'J.', sku: 'JJ-WSC-004', stock: 8, featured: 1, status: 'published', tags: 'net, embroidered, formal, evening', sizes: 'M,L,XL', colors: 'Black,Maroon,Emerald', materials: 'Net, Silk', weight: 0.4, image_index: 11 },
  { name: 'Printed Lawn Dupatta', description: 'Vibrant printed lawn dupatta to complement any suit. Lightweight and versatile with a soft drape. Features traditional and contemporary patterns.', short_description: 'Vibrant printed lawn dupatta', price: 1499, sale_price: null, category: 'SUMMER COLLECTION', gender: 'WOMEN', subcategory: 'summer-collection', collection: 'summer-2026', brand: 'J.', sku: 'JJ-WSC-005', stock: 55, featured: 0, status: 'published', tags: 'dupatta, lawn, printed, summer, lightweight', sizes: 'One Size', colors: 'Multi,Blue,Yellow', materials: 'Lawn', weight: 0.1, image_index: 16 },
  { name: 'Embroidered Organza Dupatta', description: 'Sheer organza dupatta with delicate floral embroidery along the borders. A stunning accessory for special occasions. The lightweight fabric creates an ethereal look.', short_description: 'Sheer organza dupatta with floral embroidery', price: 3599, sale_price: 2999, category: 'SUMMER COLLECTION', gender: 'WOMEN', subcategory: 'summer-collection', collection: 'premium', brand: 'J.', sku: 'JJ-WSC-006', stock: 15, featured: 0, status: 'published', tags: 'dupatta, organza, embroidered, floral, premium', sizes: 'One Size', colors: 'White,Gold,Silver', materials: 'Organza', weight: 0.12, image_index: 23 },
  { name: 'Summer Lawn Suit - Pastel', description: 'Soft pastel-toned lawn suit for a refreshing summer look. Features subtle embroidery details on a lightweight lawn fabric. Comfortable and stylish for daily wear.', short_description: 'Pastel-toned summer lawn suit', price: 4899, sale_price: 4299, category: 'SUMMER COLLECTION', gender: 'WOMEN', subcategory: 'summer-collection', collection: 'summer-2026', brand: 'J.', sku: 'JJ-WSC-007', stock: 20, featured: 0, status: 'published', tags: 'lawn, pastel, summer, casual, daily-wear', sizes: 'S,M,L,XL', colors: 'Lavender,Mint,Peach', materials: 'Lawn Cotton', weight: 0.3, image_index: 27 },
  { name: 'Geometric Print Lawn', description: 'Modern geometric print on premium lawn fabric. Bold and contemporary design for the fashion-forward woman. Features clean lines and structured patterns.', short_description: 'Modern geometric print lawn suit', price: 4199, sale_price: 3799, category: 'SUMMER COLLECTION', gender: 'WOMEN', subcategory: 'summer-collection', collection: 'summer-2026', brand: 'J.', sku: 'JJ-WSC-008', stock: 30, featured: 0, status: 'published', tags: 'lawn, geometric, printed, modern, trendy', sizes: 'S,M,L,XL', colors: 'Black,White,Navy', materials: 'Lawn', weight: 0.3, image_index: 36 },
  { name: 'Embroidered Kaftan', description: 'Flowing kaftan with all-over embroidery. Luxurious comfort for special events and beach vacations. The relaxed fit makes it perfect for warm-weather destinations.', short_description: 'Luxurious embroidered kaftan', price: 7999, sale_price: null, category: 'SUMMER COLLECTION', gender: 'WOMEN', subcategory: 'summer-collection', collection: 'resort', brand: 'J.', sku: 'JJ-WSC-009', stock: 6, featured: 0, status: 'published', tags: 'kaftan, embroidered, resort, luxury, beach', sizes: 'S,M,L', colors: 'White,Blue,Coral', materials: 'Cotton, Silk', weight: 0.35, image_index: 43 },

  // === WOMEN: Co-ords ===
  { name: 'Summer Chiffon Co-ords', description: 'Elegant two-piece chiffon ensemble. Lightweight and perfect for summer events. Features coordinated top and bottom with complementary embroidery.', short_description: 'Two-piece chiffon co-ord set', price: 7299, sale_price: 6499, category: 'CO-ORDS', gender: 'WOMEN', subcategory: 'co-ords', collection: 'summer-2026', brand: 'J.', sku: 'JJ-WCO-001', stock: 10, featured: 0, status: 'published', tags: 'co-ords, chiffon, two-piece, summer, elegant', sizes: 'S,M,L', colors: 'Teal,Blush,Grey', materials: 'Chiffon', weight: 0.4, image_index: 19 },
  { name: 'Velvet Embroidered Co-ord', description: 'Luxurious velvet co-ord set with gold embroidery. Statement piece for winter events and festive occasions. Rich fabric with intricate metallic threadwork.', short_description: 'Luxury velvet co-ord with gold embroidery', price: 8499, sale_price: 7499, category: 'CO-ORDS', gender: 'WOMEN', subcategory: 'co-ords', collection: 'premium', brand: 'J.', sku: 'JJ-WCO-002', stock: 8, featured: 1, status: 'published', tags: 'co-ords, velvet, embroidered, gold, festive', sizes: 'S,M,L', colors: 'Burgundy,Navy,Black', materials: 'Velvet', weight: 0.55, image_index: 28 },
  { name: 'Summer Beach Co-ords', description: 'Breezy co-ord set perfect for beach vacations. Light and tropical vibes with a relaxed fit. Made from breathable fabric for maximum comfort.', short_description: 'Beach-ready co-ord set', price: 4499, sale_price: 3999, category: 'CO-ORDS', gender: 'WOMEN', subcategory: 'co-ords', collection: 'resort', brand: 'J.', sku: 'JJ-WCO-003', stock: 22, featured: 0, status: 'published', tags: 'co-ords, beach, tropical, casual, summer', sizes: 'S,M,L,XL', colors: 'Coral,White,Blue', materials: 'Cotton Linen', weight: 0.35, image_index: 33 },
  { name: 'Pastel Co-ord Set', description: 'Soft pastel co-ord set with subtle embroidery. Elegant and understated for refined taste. Perfect for brunches, garden parties, and daytime events.', short_description: 'Elegant pastel co-ord set', price: 6499, sale_price: 5999, category: 'CO-ORDS', gender: 'WOMEN', subcategory: 'co-ords', collection: 'summer-2026', brand: 'J.', sku: 'JJ-WCO-004', stock: 18, featured: 0, status: 'published', tags: 'co-ords, pastel, embroidered, elegant, daytime', sizes: 'S,M,L', colors: 'Lilac,Mint,Cream', materials: 'Lawn, Chiffon', weight: 0.35, image_index: 42 },

  // === WOMEN: Ready to Wear ===
  { name: 'Silk Embroidered Kurti', description: 'Elegant silk kurti with detailed embroidery. Versatile for casual and formal wear. Features a flattering cut and premium silk fabric.', short_description: 'Premium silk embroidered kurti', price: 5299, sale_price: 4699, category: 'READY TO WEAR', gender: 'WOMEN', subcategory: 'ready-to-wear', collection: 'signature', brand: 'J.', sku: 'JJ-WRW-001', stock: 15, featured: 0, status: 'published', tags: 'kurti, silk, embroidered, ready-to-wear, premium', sizes: 'S,M,L,XL', colors: 'Gold,Green,Blue', materials: 'Silk', weight: 0.3, image_index: 34 },
  { name: 'Pret a Porter Collection', description: 'Ready-to-wear western-inspired collection. Modern cuts with eastern elegance. Features contemporary designs tailored for the modern Pakistani woman.', short_description: 'Modern ready-to-wear ensemble', price: 5699, sale_price: 4999, category: 'READY TO WEAR', gender: 'WOMEN', subcategory: 'ready-to-wear', collection: 'signature', brand: 'J.', sku: 'JJ-WRW-002', stock: 25, featured: 0, status: 'published', tags: 'ready-to-wear, pret, modern, western, fusion', sizes: 'S,M,L', colors: 'Black,White,Navy', materials: 'Cotton Blend', weight: 0.35, image_index: 20 },

  // === WOMEN: Unstitched ===
  { name: 'Silk Unstitched Collection', description: 'Premium unstitched silk fabric with digital print. Customizable tailoring for the perfect fit. High-quality fabric with vibrant, fade-resistant prints.', short_description: 'Premium unstitched silk fabric', price: 6799, sale_price: 5999, category: 'UNSTITCHED', gender: 'WOMEN', subcategory: 'unstitched', collection: 'premium', brand: 'J.', sku: 'JJ-WUN-001', stock: 20, featured: 1, status: 'published', tags: 'unstitched, silk, fabric, premium, customizable', sizes: '3m,5m', colors: 'Multi', materials: 'Silk', weight: 0.5, image_index: 5 },
  { name: 'Unstitched Cotton Khaddar', description: 'Premium cotton khaddar fabric for winter tailoring. Soft and warm with a comfortable feel. Ideal for custom-made winter outfits.', short_description: 'Premium cotton khaddar fabric', price: 3999, sale_price: 3499, category: 'UNSTITCHED', gender: 'WOMEN', subcategory: 'unstitched', collection: 'winter-2026', brand: 'J.', sku: 'JJ-WUN-002', stock: 45, featured: 0, status: 'published', tags: 'unstitched, khaddar, cotton, winter, fabric', sizes: '3m,5m', colors: 'Grey,Black,Brown', materials: 'Khaddar Cotton', weight: 0.6, image_index: 14 },
  { name: 'Bridal Unstitched Collection', description: 'Premium unstitched bridal fabric with heavy embroidery. Perfect for wedding season. Features intricate zardozi and resham work on luxurious fabric.', short_description: 'Luxury bridal unstitched fabric', price: 15999, sale_price: 12999, category: 'UNSTITCHED', gender: 'WOMEN', subcategory: 'unstitched', collection: 'bridal', brand: 'J.', sku: 'JJ-WUN-003', stock: 3, featured: 1, status: 'published', tags: 'bridal, unstitched, embroidered, wedding, luxury', sizes: '5m,7m', colors: 'Red,Gold,Maroon', materials: 'Silk, Velvet', weight: 0.8, image_index: 25 },
  { name: 'Premium Cotton Unstitched', description: 'High-thread-count cotton fabric for custom tailoring. Smooth and durable with a premium feel. Perfect for everyday wear and formal occasions.', short_description: 'High-quality cotton unstitched fabric', price: 3299, sale_price: null, category: 'UNSTITCHED', gender: 'WOMEN', subcategory: 'unstitched', collection: 'essentials', brand: 'J.', sku: 'JJ-WUN-004', stock: 40, featured: 0, status: 'published', tags: 'unstitched, cotton, premium, fabric, everyday', sizes: '3m,5m', colors: 'White,Beige,Black', materials: 'Cotton', weight: 0.5, image_index: 29 },
  { name: 'Summer Unstitched Volume', description: 'Collection of 3 unstitched summer suits. Mix and match for versatile looks. Great value for money with coordinated fabric sets.', short_description: '3-piece summer unstitched bundle', price: 11999, sale_price: 9999, category: 'UNSTITCHED', gender: 'WOMEN', subcategory: 'unstitched', collection: 'summer-2026', brand: 'J.', sku: 'JJ-WUN-005', stock: 10, featured: 0, status: 'published', tags: 'unstitched, summer, bundle, value-set, 3-piece', sizes: '3m,5m', colors: 'Multi', materials: 'Lawn Cotton', weight: 0.9, image_index: 40 },

  // === WOMEN: Formals ===
  { name: 'Luxury Velvet Formals', description: 'Rich velvet formal ensemble with gold thread embroidery. A show-stopping piece for weddings and galas. Features intricate handwork and premium finishing.', short_description: 'Rich velvet formal ensemble', price: 8999, sale_price: 7999, category: 'FORMALS', gender: 'WOMEN', subcategory: 'formals', collection: 'premium', brand: 'J.', sku: 'JJ-WFO-001', stock: 15, featured: 1, status: 'published', tags: 'formal, velvet, embroidered, wedding, luxury', sizes: 'M,L,XL', colors: 'Burgundy,Navy,Black', materials: 'Velvet', weight: 0.6, image_index: 3 },
  { name: 'Silk Formal Dress', description: 'Luxurious silk formal dress with intricate handwork. Statement piece for weddings and special occasions. Features delicate embroidery and beadwork.', short_description: 'Luxurious silk formal gown', price: 12999, sale_price: 10999, category: 'FORMALS', gender: 'WOMEN', subcategory: 'formals', collection: 'bridal', brand: 'J.', sku: 'JJ-WFO-002', stock: 5, featured: 1, status: 'published', tags: 'formal, silk, gown, wedding, handwork', sizes: 'S,M,L', colors: 'Gold,White,Blush', materials: 'Silk', weight: 0.5, image_index: 15 },
  { name: 'Formal Sharara Set', description: 'Gorgeous sharara set with mirror work embroidery. Perfect for festive occasions and mehndi events. Features a comfortable fit with elegant flair.', short_description: 'Embroidered sharara set', price: 9499, sale_price: 8499, category: 'FORMALS', gender: 'WOMEN', subcategory: 'formals', collection: 'festive', brand: 'J.', sku: 'JJ-WFO-003', stock: 7, featured: 0, status: 'published', tags: 'sharara, formal, mirror-work, festive, mehndi', sizes: 'S,M,L,XL', colors: 'Red,Green,Blue', materials: 'Silk, Cotton', weight: 0.55, image_index: 21 },
  { name: 'Embroidered Formal Gown', description: 'Floor-length formal gown with intricate threadwork. Perfect for special occasions and red-carpet events. Features a modern silhouette with traditional craftsmanship.', short_description: 'Floor-length embroidered gown', price: 11999, sale_price: 9999, category: 'FORMALS', gender: 'WOMEN', subcategory: 'formals', collection: 'premium', brand: 'J.', sku: 'JJ-WFO-004', stock: 4, featured: 0, status: 'published', tags: 'gown, formal, embroidered, evening, premium', sizes: 'S,M,L', colors: 'Black,Navy,Burgundy', materials: 'Silk, Tulle', weight: 0.5, image_index: 30 },

  // === WOMEN: Accessories ===
  { name: 'Pearl & Gold Accessories Set', description: 'Elegant pearl and gold-plated jewelry set. Includes necklace, earrings, and bracelet. Perfect for completing any formal or casual ensemble.', short_description: 'Pearl and gold jewelry set', price: 4299, sale_price: 3799, category: 'ACCESSORIES', gender: 'WOMEN', subcategory: 'accessories', collection: 'accessories', brand: 'J.', sku: 'JJ-WAC-001', stock: 35, featured: 0, status: 'published', tags: 'jewelry, pearl, gold, accessories, set', sizes: 'One Size', colors: 'Gold,White', materials: 'Gold-plated, Pearl', weight: 0.15, image_index: 8 },
  { name: 'Designer Clutch Bag', description: 'Stylish designer clutch with metallic finish. Perfect for evening events and formal dinners. Features a secure magnetic closure and interior pocket.', short_description: 'Metallic designer clutch bag', price: 3299, sale_price: null, category: 'ACCESSORIES', gender: 'WOMEN', subcategory: 'accessories', collection: 'accessories', brand: 'J.', sku: 'JJ-WAC-002', stock: 28, featured: 0, status: 'published', tags: 'clutch, bag, accessories, evening, formal', sizes: 'One Size', colors: 'Gold,Silver,Black', materials: 'Leather, Metal', weight: 0.25, image_index: 13 },
  { name: 'Woven Scarf Collection', description: 'Hand-woven silk and wool blend scarf. Luxurious texture and warmth for cooler months. Features traditional weaving patterns with modern colorways.', short_description: 'Hand-woven silk and wool scarf', price: 1899, sale_price: null, category: 'ACCESSORIES', gender: 'WOMEN', subcategory: 'accessories', collection: 'accessories', brand: 'J.', sku: 'JJ-WAC-003', stock: 42, featured: 0, status: 'published', tags: 'scarf, woven, silk, wool, accessories', sizes: 'One Size', colors: 'Multi,Red,Blue', materials: 'Silk, Wool', weight: 0.15, image_index: 18 },
  { name: 'Rose Gold Earrings', description: 'Stunning rose gold plated earrings with crystal accents. Lightweight and elegant for daily wear. Features a secure butterfly closure.', short_description: 'Rose gold crystal earrings', price: 2199, sale_price: 1899, category: 'ACCESSORIES', gender: 'WOMEN', subcategory: 'accessories', collection: 'accessories', brand: 'J.', sku: 'JJ-WAC-004', stock: 50, featured: 0, status: 'published', tags: 'earrings, rose-gold, crystal, accessories, daily-wear', sizes: 'One Size', colors: 'Rose Gold', materials: 'Gold-plated, Crystal', weight: 0.05, image_index: 26 },
  { name: 'Leather Crossbody Bag', description: 'Premium leather crossbody bag with adjustable strap. Practical and stylish for everyday use. Features multiple compartments for organization.', short_description: 'Premium leather crossbody bag', price: 5999, sale_price: 5299, category: 'ACCESSORIES', gender: 'WOMEN', subcategory: 'accessories', collection: 'accessories', brand: 'J.', sku: 'JJ-WAC-005', stock: 18, featured: 0, status: 'published', tags: 'bag, crossbody, leather, accessories, everyday', sizes: 'One Size', colors: 'Black,Brown,Tan', materials: 'Leather', weight: 0.4, image_index: 31 },
  { name: 'Handmade Potli Bag', description: 'Traditional handmade potli bag with beadwork. Perfect for festive occasions and weddings. Features drawstring closure with decorative tassels.', short_description: 'Traditional beadwork potli bag', price: 1699, sale_price: null, category: 'ACCESSORIES', gender: 'WOMEN', subcategory: 'accessories', collection: 'accessories', brand: 'J.', sku: 'JJ-WAC-006', stock: 48, featured: 0, status: 'published', tags: 'potli, bag, traditional, festive, handmade', sizes: 'One Size', colors: 'Red,Gold,Green', materials: 'Silk, Beads', weight: 0.1, image_index: 39 },
  { name: 'Signature Fragrance Set', description: 'Collection of 3 signature fragrances. Long-lasting scents for every occasion. Features floral, woody, and oriental notes in elegant packaging.', short_description: 'Collection of 3 signature perfumes', price: 8999, sale_price: 7999, category: 'ACCESSORIES', gender: 'WOMEN', subcategory: 'accessories', collection: 'fragrance', brand: 'J.', sku: 'JJ-WAC-007', stock: 20, featured: 0, status: 'published', tags: 'fragrance, perfume, set, signature, luxury', sizes: '50ml,30ml', colors: '', materials: 'Alcohol-based Fragrance', weight: 0.5, image_index: 44 },

  // === MEN: Ready to Wear ===
  { name: 'Ready to Wear Kurta', description: 'Classic straight-cut kurta in premium cotton. Available in multiple colors. Features a comfortable fit with side slits and a mandarin collar.', short_description: 'Classic cotton kurta', price: 3499, sale_price: 2999, category: 'READY TO WEAR', gender: 'MEN', subcategory: 'ready-to-wear', collection: 'essentials', brand: 'J.', sku: 'JJ-MRW-001', stock: 50, featured: 1, status: 'published', tags: 'kurta, cotton, men, ready-to-wear, classic', sizes: 'M,L,XL,XXL', colors: 'White,Black,Blue,Grey', materials: 'Cotton', weight: 0.35, image_index: 6 },
  { name: 'Casual Cotton Trousers', description: 'Comfortable cotton trousers with elastic waistband. Perfect daily wear for casual and semi-formal occasions. Features a relaxed fit with practical pockets.', short_description: 'Comfortable cotton trousers', price: 1999, sale_price: null, category: 'READY TO WEAR', gender: 'MEN', subcategory: 'ready-to-wear', collection: 'essentials', brand: 'J.', sku: 'JJ-MRW-002', stock: 60, featured: 0, status: 'published', tags: 'trousers, cotton, men, casual, daily-wear', sizes: 'M,L,XL,XXL', colors: 'Black,Grey,Navy,Beige', materials: 'Cotton', weight: 0.3, image_index: 12 },
  { name: "Men's Classic Waistcoat", description: 'Tailored waistcoat in premium fabric. Pairs perfectly with shalwar kameez for a complete formal look. Features a slim fit with traditional detailing.', short_description: 'Tailored formal waistcoat', price: 2799, sale_price: null, category: 'READY TO WEAR', gender: 'MEN', subcategory: 'ready-to-wear', collection: 'essentials', brand: 'J.', sku: 'JJ-MRW-003', stock: 30, featured: 0, status: 'published', tags: 'waistcoat, men, formal, traditional, tailored', sizes: 'M,L,XL', colors: 'Black,White,Grey,Navy', materials: 'Cotton Blend', weight: 0.25, image_index: 17 },
  { name: "Men's Linen Shalwar Kameez", description: 'Breathable linen shalwar kameez for hot summer days. Comfortable and stylish with a relaxed fit. Features natural fabric that keeps you cool.', short_description: 'Breathable linen shalwar kameez', price: 4299, sale_price: 3799, category: 'READY TO WEAR', gender: 'MEN', subcategory: 'ready-to-wear', collection: 'summer-2026', brand: 'J.', sku: 'JJ-MRW-004', stock: 32, featured: 0, status: 'published', tags: 'shalwar-kameez, linen, men, summer, casual', sizes: 'M,L,XL,XXL', colors: 'White,Beige,Blue,Grey', materials: 'Linen', weight: 0.4, image_index: 24 },
  { name: 'Casual Linen Pants', description: 'Relaxed-fit linen pants for everyday comfort. Available in earthy tones. Features an elastic waistband and side pockets for practicality.', short_description: 'Relaxed-fit linen pants', price: 2499, sale_price: null, category: 'READY TO WEAR', gender: 'MEN', subcategory: 'ready-to-wear', collection: 'summer-2026', brand: 'J.', sku: 'JJ-MRW-005', stock: 35, featured: 0, status: 'published', tags: 'pants, linen, men, casual, summer', sizes: 'M,L,XL', colors: 'Beige,Grey,Navy,Khaki', materials: 'Linen', weight: 0.3, image_index: 38 },

  // === MEN: Formals ===
  { name: "Men's Formal Shalwar Kameez", description: 'Traditional shalwar kameez in premium Pakistani cotton. Perfect for formal occasions, weddings, and Eid. Features fine stitching and a comfortable fit.', short_description: 'Premium formal shalwar kameez', price: 4999, sale_price: 4499, category: 'FORMALS', gender: 'MEN', subcategory: 'formals', collection: 'festive', brand: 'J.', sku: 'JJ-MFO-001', stock: 22, featured: 0, status: 'published', tags: 'shalwar-kameez, formal, men, wedding, cotton', sizes: 'M,L,XL,XXL', colors: 'White,Black,Grey,Navy', materials: 'Cotton', weight: 0.45, image_index: 9 },
  { name: "Men's Formal Waistcoat Suit", description: 'Three-piece formal suit with waistcoat. Tailored for a sharp professional look. Features premium fabric with a modern slim fit.', short_description: 'Three-piece formal waistcoat suit', price: 9999, sale_price: 8999, category: 'FORMALS', gender: 'MEN', subcategory: 'formals', collection: 'premium', brand: 'J.', sku: 'JJ-MFO-002', stock: 12, featured: 0, status: 'published', tags: 'suit, formal, waistcoat, men, professional', sizes: 'M,L,XL', colors: 'Black,Navy,Grey', materials: 'Wool Blend', weight: 0.8, image_index: 41 },
  { name: 'Formal Sherwani Set', description: 'Distinguished sherwani set with intricate zardozi work. Perfect for groomsmen and wedding guests. Features a regal design with premium craftsmanship.', short_description: 'Premium sherwani with zardozi work', price: 18999, sale_price: 15999, category: 'FORMALS', gender: 'MEN', subcategory: 'formals', collection: 'bridal', brand: 'J.', sku: 'JJ-MFO-003', stock: 2, featured: 1, status: 'published', tags: 'sherwani, formal, wedding, men, zardozi', sizes: 'M,L,XL', colors: 'Black,Maroon,Gold', materials: 'Silk, Velvet', weight: 0.9, image_index: 37 },

  // === MEN: Co-ords ===
  { name: 'Linen Summer Co-ords', description: 'Premium linen co-ord set for men. Breathable fabric with modern design. Features a coordinated shirt and trousers for a stylish summer look.', short_description: 'Premium linen co-ord set', price: 6299, sale_price: 5599, category: 'CO-ORDS', gender: 'MEN', subcategory: 'co-ords', collection: 'summer-2026', brand: 'J.', sku: 'JJ-MCO-001', stock: 12, featured: 0, status: 'published', tags: 'co-ords, linen, men, summer, modern', sizes: 'M,L,XL', colors: 'White,Blue,Beige', materials: 'Linen', weight: 0.5, image_index: 10 },

  // === MEN: Accessories ===
  { name: 'Traditional Peshawari Chappal', description: 'Handcrafted leather Peshawari chappal. Classic design with modern comfort features. Durable construction with traditional hand-stitched detailing.', short_description: 'Handcrafted leather Peshawari chappal', price: 3799, sale_price: 3299, category: 'ACCESSORIES', gender: 'MEN', subcategory: 'accessories', collection: 'accessories', brand: 'J.', sku: 'JJ-MAC-001', stock: 25, featured: 0, status: 'published', tags: 'chappal, peshawari, leather, men, traditional', sizes: '39,40,41,42,43,44', colors: 'Black,Brown,Tan', materials: 'Leather', weight: 0.4, image_index: 35 },

  // === TEENS ===
  { name: 'Kids Summer Collection', description: 'Comfortable and colorful summer wear for kids. Soft fabrics designed for sensitive skin with fun patterns and bright colors. Easy to wear and maintain.', short_description: 'Colorful kids summer wear', price: 2499, sale_price: 1999, category: 'SUMMER COLLECTION', gender: 'TEENS', subcategory: 'summer-collection', collection: 'summer-2026', brand: 'J.', sku: 'JJ-TSC-001', stock: 38, featured: 0, status: 'published', tags: 'kids, summer, casual, colorful, comfortable', sizes: '2-3Y,3-4Y,4-5Y,5-6Y', colors: 'Multi,Blue,Pink', materials: 'Cotton', weight: 0.2, image_index: 22 },
  { name: 'Kids Ready to Wear', description: 'Adorable ready-to-wear outfits for kids. Easy to put on and comfortable all day. Features playful designs with child-friendly fabrics.', short_description: 'Adorable kids ready-to-wear outfit', price: 1999, sale_price: null, category: 'READY TO WEAR', gender: 'TEENS', subcategory: 'ready-to-wear', collection: 'essentials', brand: 'J.', sku: 'JJ-TRW-001', stock: 45, featured: 0, status: 'published', tags: 'kids, ready-to-wear, casual, comfortable, daily', sizes: '2-3Y,3-4Y,4-5Y,5-6Y', colors: 'Multi,Blue,Pink', materials: 'Cotton', weight: 0.2, image_index: 32 },
];

function getImageUrl(index: number): string {
  return `/images/products/product-${index}.jpg`;
}

export async function POST(request: NextRequest) {
  try {
    const key = request.headers.get('X-API-Key');
    if (!verifyApiKey(key, 'admin')) {
      return NextResponse.json({ success: false, message: 'Invalid or missing API key' }, { status: 401 });
    }

    await initDb();

    const existing = queryAll('SELECT COUNT(*) as count FROM products');
    const count = (existing[0]?.count as number) ?? 0;
    const fresh = (await request.json() as { fresh?: boolean }).fresh ?? false;

    if (count > 0 && !fresh) {
      return NextResponse.json({
        success: false,
        message: `Database already has ${count} products. Use { "fresh": true } to reseed.`,
      });
    }

    if (count > 0 && fresh) {
      execute('DELETE FROM product_images');
      execute('DELETE FROM products');
      execute('DELETE FROM categories');
      execute('DELETE FROM collections');
    }

    const categories = [
      { name: 'SUMMER COLLECTION', slug: 'summer-collection', description: 'Seasonal summer fashion', gender: 'WOMEN', sort_order: 1 },
      { name: 'CO-ORDS', slug: 'co-ords', description: 'Coordinated two-piece sets', gender: 'WOMEN', sort_order: 2 },
      { name: 'READY TO WEAR', slug: 'ready-to-wear', description: 'Ready-made fashion', gender: 'WOMEN', sort_order: 3 },
      { name: 'UNSTITCHED', slug: 'unstitched', description: 'Unstitched fabric collections', gender: 'WOMEN', sort_order: 4 },
      { name: 'FORMALS', slug: 'formals', description: 'Formal and occasion wear', gender: 'WOMEN', sort_order: 5 },
      { name: 'ACCESSORIES', slug: 'accessories', description: 'Fashion accessories', gender: 'WOMEN', sort_order: 6 },
      { name: 'MEN READY TO WEAR', slug: 'men-ready-to-wear', description: 'Men\'s ready-made fashion', gender: 'MEN', sort_order: 7 },
      { name: 'MEN FORMALS', slug: 'men-formals', description: 'Men\'s formal wear', gender: 'MEN', sort_order: 8 },
      { name: 'MEN ACCESSORIES', slug: 'men-accessories', description: 'Men\'s accessories', gender: 'MEN', sort_order: 9 },
      { name: 'TEENS WEAR', slug: 'teens-wear', description: 'Fashion for teens and kids', gender: 'TEENS', sort_order: 10 },
    ];

    for (const cat of categories) {
      const exists = queryOne('SELECT id FROM categories WHERE slug = ?', [cat.slug]);
      if (!exists) {
        execute(
          `INSERT INTO categories (name, slug, description, gender, sort_order) VALUES (?, ?, ?, ?, ?)`,
          [cat.name, cat.slug, cat.description, cat.gender, cat.sort_order]
        );
      }
    }

    const collections = [
      { name: 'Summer 2026', slug: 'summer-2026', description: 'Summer 2026 collection', is_active: 1, sort_order: 1 },
      { name: 'Premium', slug: 'premium', description: 'Premium luxury collection', is_active: 1, sort_order: 2 },
      { name: 'Signature', slug: 'signature', description: 'J. Signature collection', is_active: 1, sort_order: 3 },
      { name: 'Essentials', slug: 'essentials', description: 'Everyday wardrobe essentials', is_active: 1, sort_order: 4 },
      { name: 'Bridal', slug: 'bridal', description: 'Bridal and wedding collection', is_active: 1, sort_order: 5 },
      { name: 'Festive', slug: 'festive', description: 'Festive occasion wear', is_active: 1, sort_order: 6 },
      { name: 'Resort', slug: 'resort', description: 'Vacation and resort wear', is_active: 1, sort_order: 7 },
      { name: 'Winter 2026', slug: 'winter-2026', description: 'Winter 2026 collection', is_active: 0, sort_order: 8 },
      { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories', is_active: 1, sort_order: 9 },
      { name: 'Fragrance', slug: 'fragrance', description: 'Signature fragrances', is_active: 1, sort_order: 10 },
    ];

    for (const col of collections) {
      const exists = queryOne('SELECT id FROM collections WHERE slug = ?', [col.slug]);
      if (!exists) {
        execute(
          `INSERT INTO collections (name, slug, description, is_active, sort_order) VALUES (?, ?, ?, ?, ?)`,
          [col.name, col.slug, col.description, col.is_active, col.sort_order]
        );
      }
    }

    for (const product of PRODUCTS) {
      const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const metaTitle = `${product.name} | J. (Junaid Jamshed)`;
      const metaDescription = product.short_description;

      const result = execute(
        `INSERT INTO products (name, slug, sku, description, short_description, price, sale_price, stock, category, gender, subcategory, collection, brand, status, visibility, featured, tags, sizes, colors, materials, weight, seo_title, seo_description, seo_keywords, meta_title, meta_description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name, slug, product.sku, product.description, product.short_description,
          product.price, product.sale_price, product.stock, product.category, product.gender,
          product.subcategory, product.collection, product.brand, product.status, 'visible',
          product.featured, product.tags, product.sizes, product.colors, product.materials,
          product.weight, metaTitle, metaDescription, product.tags, metaTitle, metaDescription
        ]
      );

      const productId = result.lastInsertRowid;

      const primaryImageUrl = getImageUrl(product.image_index);
      execute(
        'INSERT INTO product_images (product_id, url, alt, type, sort_order) VALUES (?, ?, ?, ?, ?)',
        [productId, primaryImageUrl, product.name, 'primary', 0]
      );

      const galleryIndex = product.image_index < 44 ? product.image_index + 1 : 1;
      if (galleryIndex <= 44 && galleryIndex !== product.image_index) {
        execute(
          'INSERT INTO product_images (product_id, url, alt, type, sort_order) VALUES (?, ?, ?, ?, ?)',
          [productId, getImageUrl(galleryIndex), `${product.name} - View 2`, 'gallery', 1]
        );
      }
    }

    const productCount = queryOne('SELECT COUNT(*) as count FROM products')?.count ?? 0;
    const imageCount = queryOne('SELECT COUNT(*) as count FROM product_images')?.count ?? 0;

    return NextResponse.json({
      success: true,
      message: `Seeded ${productCount} products with ${imageCount} images successfully`,
      data: {
        products: productCount,
        images: imageCount,
        categories: categories.length,
        collections: collections.length,
      }
    });
  } catch (error) {
    console.error('POST /api/seed error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
