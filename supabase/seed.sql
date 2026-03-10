-- Seed data for Tawakkal Paint Store with actual product images

-- Clear existing data
DELETE FROM cart_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM users;

-- Berger's Products
INSERT INTO products (name, brand, category, sub_category, description, image_url, price_quarter, price_gallon, price_drum, in_stock) VALUES
-- Berger Interior
('Weather Coat Elegance Emulsion', 'Berger', 'decorative', 'interior', 'Premium interior emulsion with elegant finish', '/images/products/berger/elegance emulsion.png', 1450, 4900, 22800, true),
('Weather Coat Silk Finish', 'Berger', 'decorative', 'interior', 'Luxurious silk finish for interior walls', '/images/products/berger/elegance silk finish.png', 1600, 5500, 25500, true),
('Weather Coat NU Emulsion', 'Berger', 'decorative', 'interior', 'Premium quality emulsion paint', '/images/products/berger/nu emulsion.png', 1350, 4600, 21400, true),
('Weather Coat Semi Plastic Emulsion', 'Berger', 'decorative', 'interior', 'Semi plastic emulsion for walls', '/images/products/berger/semi plastic emulsion.png', 1200, 4100, 19000, true),
('Weather Coat Silk Emulsion', 'Berger', 'decorative', 'interior', 'Smooth silk emulsion finish', '/images/products/berger/silk emulsion.png', 1550, 5300, 24600, true),
('Weather Coat Superior Matt Finish', 'Berger', 'decorative', 'interior', 'Superior matt finish paint', '/images/products/berger/superior matt finish.png', 1400, 4800, 22300, true),
('Weather Coat NU Enamel', 'Berger', 'decorative', 'wood_metal', 'High quality enamel paint', '/images/products/berger/nu enamel.png', 1800, 6200, 28800, true),
('Weather Coat Super Gloss Enamel', 'Berger', 'decorative', 'wood_metal', 'Super gloss enamel for wood & metal', '/images/products/berger/super gloss enamel.png', 1750, 6000, 27900, true),
('Weather Coat Top Super Emulsion', 'Berger', 'decorative', 'interior', 'Top quality emulsion paint', '/images/products/berger/top super emulsion.png', 1500, 5100, 23700, true),

-- Berger Exterior
('Weather Coat Weather Pro', 'Berger', 'decorative', 'exterior', 'Advanced exterior paint', '/images/products/berger/weather pro.webp', 1650, 5600, 26000, true),
('Weather Coat VIP Weather Coat', 'Berger', 'decorative', 'exterior', 'Premium exterior weather coating', '/images/products/berger/vip weather coat.webp', 1700, 5800, 27000, true),
('Weather Coat Glow 365', 'Berger', 'decorative', 'exterior', 'Long lasting exterior paint', '/images/products/berger/weather coat glow 365.webp', 1600, 5500, 25500, true),
('Weather Coat Pure Seal', 'Berger', 'decorative', 'exterior', 'Protective exterior coating', '/images/products/berger/weather coat pure seal.webp', 1550, 5300, 24600, true),

-- Berger Putty & Primer
('Weather Coat SPD Wall Putty', 'Berger', 'decorative', 'accessories', 'White cement based wall putty', '/images/products/berger/spd wall putty.webp', 650, 2200, 0, true),
('Weather Coat Top Super Putty', 'Berger', 'decorative', 'accessories', 'Premium quality putty', '/images/products/berger/top super putty.webp', 700, 2400, 0, true),
('Weather Coat NU Putty', 'Berger', 'decorative', 'accessories', 'Interior wall putty', '/images/products/berger/nu putty.webp', 600, 2000, 0, true),
('Weather Coat Weather Pro Exterior Putty', 'Berger', 'decorative', 'accessories', 'Exterior grade putty', '/images/products/berger/weather pro exterior putty.webp', 750, 2600, 0, true),
('Weather Coat Plastron Wall Primer', 'Berger', 'decorative', 'accessories', 'Water based wall primer', '/images/products/berger/PLASTRON WALL PRIMER.webp', 550, 1800, 0, true),
('Weather Coat Top Super Primer Plus', 'Berger', 'decorative', 'accessories', 'Premium water based primer', '/images/products/berger/Top Super Primer Plus water base priemer.webp', 600, 2000, 0, true),
('Weather Coat Elegance Interior Putty', 'Berger', 'decorative', 'accessories', 'Interior wall filling putty', '/images/products/berger/elegance enterior putty.webp', 680, 2300, 0, true),

-- Berger Wood & Metal
('Berger Allrounder Matt Enamel', 'Berger', 'decorative', 'wood_metal', 'Matt enamel for wood, metal & wall', '/images/products/berger/allrounder matt enamel (wood, metal & wall).webp', 1850, 6300, 29300, true),
('Berger Red Oxide Primer', 'Berger', 'decorative', 'wood_metal', 'Red oxide primer for metal', '/images/products/berger/Red-Oxide-Primer.webp', 950, 3200, 0, true),
('Berger Synthetic Under Coat', 'Berger', 'decorative', 'wood_metal', 'Synthetic undercoat', '/images/products/berger/Synthetic-Under-Coat.webp', 900, 3000, 0, true),
('Berger Aluminum Paint', 'Berger', 'decorative', 'wood_metal', 'Aluminum paint', '/images/products/berger/Aluminum-Paint.webp', 1100, 3700, 0, true),
('Berger Woodpro Gloss Lacquer', 'Berger', 'decorative', 'wood_metal', 'Gloss lacquer for wood', '/images/products/berger/woodpro gloss lacquer.webp', 2200, 7500, 0, true),
('Berger Woodpro Matt Lacquer', 'Berger', 'decorative', 'wood_metal', 'Matt lacquer for wood', '/images/products/berger/woodpro matt laquer.webp', 2100, 7200, 0, true),
('Berger Woodpro PU Lacquer', 'Berger', 'decorative', 'wood_metal', 'Polyurethane lacquer', '/images/products/berger/woodpro pu lacquer.webp', 2400, 8200, 0, true),
('Berger Woodpro Sanding Sealer', 'Berger', 'decorative', 'wood_metal', 'Sanding sealer', '/images/products/berger/woodpro sanding sealer.webp', 1800, 6100, 0, true),
('Berger Woodpro Synthetic Clear Varnish', 'Berger', 'decorative', 'wood_metal', 'Clear varnish', '/images/products/berger/woodpro synthetic clear varnish.webp', 1700, 5800, 0, true),
('Berger Advance Polyurethane 2K Clear', 'Berger', 'industrial', 'interior', '2K clear polyurethane', '/images/products/berger/Advance Polyurethane 2k Clear.webp', 3500, 12000, 0, true),
('Berger Advance Polyurethane 2K Hardener', 'Berger', 'industrial', 'interior', '2K hardener', '/images/products/berger/Advance Polyurethane 2k Hardener.webp', 3200, 11000, 0, true),

-- Gobi's Products
('Gobis Gold Wall Emulsion', 'Gobi''s', 'decorative', 'interior', 'Premium gold wall emulsion', '/images/products/gobis/Gobis-Gold-Wall-Emulsion-253x253-removebg-preview.png', 1550, 5300, 24600, true),
('Gobis Gold Aqueous Matt Finish', 'Gobi''s', 'decorative', 'interior', 'Aqueous matt finish', '/images/products/gobis/Gobis-Gold-Aqueous-Matt-Finish-253x253-removebg-preview.png', 1450, 4900, 22800, true),
('Gobis Gold Enamel', 'Gobi''s', 'decorative', 'wood_metal', 'Premium gold enamel', '/images/products/gobis/Gobis-Gold-Enamel-253x253-removebg-preview.png', 1800, 6200, 28800, true),
('Gobis Gold Red Oxide Primer', 'Gobi''s', 'decorative', 'wood_metal', 'Red oxide primer', '/images/products/gobis/Gobis-Gold-Red-Oxide-Primer-253x253-removebg-preview.png', 1000, 3400, 0, true),
('Gobis Gold Undercoat', 'Gobi''s', 'decorative', 'wood_metal', 'Gold undercoat', '/images/products/gobis/Gobis-Gold-Undercoat-253x253-removebg-preview.png', 950, 3200, 0, true),
('Gobis Gold Wall Putty', 'Gobi''s', 'decorative', 'accessories', 'Gold wall putty', '/images/products/gobis/Gobis-Gold-Wall-Putty-253x253-removebg-preview.png', 700, 2400, 0, true),
('Gobis Silksheen Emulsion', 'Gobi''s', 'decorative', 'interior', 'Silksheen emulsion finish', '/images/products/gobis/Gobis-Silksheen-Emulsion-253x253-removebg-preview.png', 1600, 5500, 25500, true),
('Gobis Silverline Emulsion', 'Gobi''s', 'decorative', 'interior', 'Silverline emulsion', '/images/products/gobis/Gobis-Silverline-Emulsion-253x253.png', 1350, 4600, 21400, true),
('Gobis Silverline Enamel', 'Gobi''s', 'decorative', 'wood_metal', 'Silverline enamel', '/images/products/gobis/Gobis-Silverline-Enamel-253x253.png', 1650, 5600, 26000, true),
('Gobis Silverline Wall Putty', 'Gobi''s', 'decorative', 'accessories', 'Silverline wall putty', '/images/products/gobis/Gobis-Silverline-Wall-Putty-253x253.png', 650, 2200, 0, true),
('Gobis Silverline Wall Sealer', 'Gobi''s', 'decorative', 'accessories', 'Silverline wall sealer', '/images/products/gobis/Gobis-Silverline-Wall-Sealer-580x580.png', 800, 2700, 0, true),
('Gobis Aqueous Matt Finish', 'Gobi''s', 'decorative', 'interior', 'Aqueous matt finish', '/images/products/gobis/Gobis-Aqueous-Matt-Finish-253x253-removebg-preview.png', 1400, 4800, 22300, true),
('Gobis Gloss Enamel', 'Gobi''s', 'decorative', 'wood_metal', 'High gloss enamel', '/images/products/gobis/Gobis-Gloss-Enamel-253x253-removebg-preview.png', 1700, 5800, 27000, true),
('Gobis Weather Protector', 'Gobi''s', 'decorative', 'exterior', 'Weather protector exterior', '/images/products/gobis/Gobis-Weather Protector.png', 1650, 5600, 26000, true),
('Gobis Gold Weather Guard', 'Gobi''s', 'decorative', 'exterior', 'Gold weather guard', '/images/products/gobis/gobi''s gold weather guard.png', 1750, 6000, 27900, true),
('Gobis Summer Weather Shield', 'Gobi''s', 'decorative', 'exterior', 'Summer weather shield', '/images/products/gobis/gobi''s-Summer-Weather-Shield.png', 1600, 5500, 25500, true),
('Gobis Wall Primer Sealer', 'Gobi''s', 'decorative', 'accessories', 'Wall primer sealer', '/images/products/gobis/Gobis-Wall-Primer-Sealer.png', 700, 2400, 0, true),
('Gobis Summer Superior Emulsion', 'Gobi''s', 'decorative', 'interior', 'Summer superior emulsion', '/images/products/gobis/Gobis-Summer-Suprior-Emulsion.png', 1450, 4900, 22800, true),
('Gobis Valmate Superior Emulsion', 'Gobi''s', 'decorative', 'interior', 'Valmate superior emulsion', '/images/products/gobis/Gobis-Valmate-Superior-Emulsion.png', 1500, 5100, 23700, true),
('Gobis Valmate Weather Shield', 'Gobi''s', 'decorative', 'exterior', 'Valmate weather shield', '/images/products/gobis/Gobis-Valmate-Weather-Shield.png', 1550, 5300, 24600, true),

-- Diamond Products
('Diamond Ace Durasilk Emulsion', 'Diamond', 'decorative', 'interior', 'Durasilk emulsion', '/images/products/diamond/Plastic-Emulsion-Special-Shade-630x630-removebg-preview.png', 1400, 4800, 22300, true),
('Diamond Matt Finish', 'Diamond', 'decorative', 'interior', 'Premium matt finish', '/images/products/diamond/Matt-Finish-Inner-630x630.png', 1350, 4600, 21400, true),
('Diamond Red Oxide', 'Diamond', 'decorative', 'wood_metal', 'Red oxide for wood & metal', '/images/products/diamond/Red-Oxide-wood-and-metal-630x630-removebg-preview.png', 1000, 3400, 0, true),
('Diamond Enamel', 'Diamond', 'decorative', 'wood_metal', 'High quality enamel', '/images/products/diamond/enamel.png', 1750, 6000, 27900, true),
('Diamond Plastic Emulsion', 'Diamond', 'decorative', 'interior', 'Plastic emulsion paint', '/images/products/diamond/plastic emulsion.png', 1300, 4400, 20500, true),
('Diamond Plastic Primer Sealer', 'Diamond', 'decorative', 'accessories', 'Plastic primer sealer', '/images/products/diamond/plastic priemer sealer.png', 650, 2200, 0, true),
('Diamond Weather Protector', 'Diamond', 'decorative', 'exterior', 'Weather protector coating', '/images/products/diamond/weather protector.png', 1600, 5500, 25500, true),
('Diamond Varnish', 'Diamond', 'decorative', 'wood_metal', 'Quality varnish', '/images/products/diamond/Warnish-630x630.png', 1800, 6200, 0, true),
('Diamond Water Matt', 'Diamond', 'decorative', 'wood_metal', 'Water based matt', '/images/products/diamond/Water-Matt-1-1024x657-removebg-preview.png', 1500, 5100, 0, true),

-- Reliance Products
('Reliance Acrylic Putty', 'Reliance', 'decorative', 'accessories', 'Acrylic wall putty', '/images/products/reliance/Reliance-Acrylic-Putty.png', 600, 2000, 0, true),
('Reliance Matt Enamel', 'Reliance', 'decorative', 'wood_metal', 'Matt enamel paint', '/images/products/reliance/Reliance-Matt-Enamel.png', 1600, 5500, 25500, true),
('Reliance Red Oxide Primer', 'Reliance', 'decorative', 'wood_metal', 'Red oxide primer', '/images/products/reliance/Reliance-Red-Oxide-Primer.png', 900, 3000, 0, true),
('Reliance Semi Plastic Emulsion', 'Reliance', 'decorative', 'interior', 'Semi plastic emulsion', '/images/products/reliance/Reliance-Semi-Plastic-Emulsion.png', 1200, 4100, 19000, true),
('Reliance Stainless Matt', 'Reliance', 'decorative', 'wood_metal', 'Stainless matt finish', '/images/products/reliance/Reliance-Stainless-Matt.png', 1700, 5800, 27000, true),
('Reliance Wall Primer Sealer', 'Reliance', 'decorative', 'accessories', 'Wall primer sealer', '/images/products/reliance/Reliance-Wall-Primer-Sealer.png', 550, 1800, 0, true),
('Reliance Water Primer Sealer', 'Reliance', 'decorative', 'accessories', 'Water based primer', '/images/products/reliance/Reliance-Water-Primer-Sealer.png', 500, 1700, 0, true),
('Reliance Weather Guard', 'Reliance', 'decorative', 'exterior', 'Weather guard exterior', '/images/products/reliance/Reliance-Weather-Guard.png', 1450, 4900, 22800, true),
('Reliance Synthetic Enamel', 'Reliance', 'decorative', 'wood_metal', 'High-quality synthetic enamel for a durable gloss finish on wood and metal.', '/images/products/reliance/reliance_synthetic_enamel.png', 1600, 5500, 25500, true);

-- Reliable Products
('Reliable Ace Flexi Primer', 'Reliable', 'decorative', 'accessories', 'Flexi primer', '/images/products/reliable/AceFlexiprimer_68b92dcf-b2dc-4299-8666-44c8af138854.webp', 550, 1800, 0, true),
('Reliable Everlast Weather Proof', 'Reliable', 'decorative', 'exterior', 'Everlast weather proof', '/images/products/reliable/Everlast-Weather-Proof.webp', 1550, 5300, 24600, true),
('Reliable Ace Durasilk Emulsion', 'Reliable', 'decorative', 'interior', 'Durasilk emulsion', '/images/products/reliable/ace Durasilk emulsion.webp', 1350, 4600, 21400, true),
('Reliable Ace Gloss Lacquer', 'Reliable', 'decorative', 'wood_metal', 'Gloss lacquer', '/images/products/reliable/ace Gloss-lacquer-Timberlac_acfb771b-f4b1-40cc-aa0b-1f42246bc090.webp', 2100, 7200, 0, true),
('Reliable Ace Hi Sparkle Metallic', 'Reliable', 'decorative', 'interior', 'Hi sparkle metallic', '/images/products/reliable/ace Hi sparkle metalic_087a2ef0-925d-43a8-9d04-c36e344d4990.webp', 1450, 4900, 0, true),
('Reliable Ace Matt Enamel', 'Reliable', 'decorative', 'wood_metal', 'Matt enamel', '/images/products/reliable/ace matt enamel.webp', 1600, 5500, 25500, true),
('Reliable Ace Super Gloss Enamel', 'Reliable', 'decorative', 'wood_metal', 'Super gloss enamel', '/images/products/reliable/ace super gloss enamel.webp', 1750, 6000, 27900, true),
('Reliable Ace Weather Defender', 'Reliable', 'decorative', 'exterior', 'Weather defender', '/images/products/reliable/ace weather defender.webp', 1500, 5100, 23700, true),
('Reliable Ace Water Based Primer', 'Reliable', 'decorative', 'accessories', 'Water based primer', '/images/products/reliable/ace water-based-primer.webp', 500, 1700, 0, true),
('Reliable Everlast High Gloss Enamel', 'Reliable', 'decorative', 'wood_metal', 'High gloss enamel', '/images/products/reliable/everlast high gloss enamel.webp', 1650, 5600, 26000, true),
('Reliable Overall Super Emulsion', 'Reliable', 'decorative', 'interior', 'Super emulsion', '/images/products/reliable/overall super emulsion.webp', 1300, 4400, 20500, true),
('Reliable Overall Wall Sealer', 'Reliable', 'decorative', 'accessories', 'Wall sealer', '/images/products/reliable/overall wallsealer_2ff76c33-b42f-4c79-bc32-fa8caf75f545.webp', 600, 2000, 0, true);

-- Update total count
SELECT COUNT(*) as total_products FROM products;
