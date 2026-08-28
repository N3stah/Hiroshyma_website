from django.core.management.base import BaseCommand
from catalog.models import Category, Product, ProductImage
from django.core.files import File
import os

class Command(BaseCommand):
    help = 'Seeds the database with Kevin\'s initial real product catalog'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting catalog seed...'))

        # 1. Create Categories
        tee_cat, _ = Category.objects.get_or_create(
            name="T-Shirts", 
            defaults={"description": "Custom-printed graphic tees and round-necks."}
        )
        bottoms_cat, _ = Category.objects.get_or_create(
            name="Bottoms", 
            defaults={"description": "Jorts, trousers, and sweatpants."}
        )
        footwear_cat, _ = Category.objects.get_or_create(
            name="Footwear", 
            defaults={"description": "Street slides and styling context."}
        )

        # 2. Define Products
        media_temp = os.path.join('media', 'temp')
        products = [
            {
                "name": "Notorious B.I.G. Graphic Tee",
                "category": tee_cat,
                "price": "1800.00",
                "sizes": ["S", "M", "L", "XL"],
                "description": "Heavyweight black cotton tee featuring a classic graphic print. Durable, street-ready, and tailored for an oversized fit.",
                "img_name": "big_tee.jpg",
                "featured": False
            },
            {
                "name": "Hiroshyma EST 2009 Graphic Tee",
                "category": tee_cat,
                "price": "2000.00",
                "sizes": ["S", "M", "L", "XL"],
                "description": "White premium tee with the official Hiroshyma EST 2009 illustrated logo. A staple piece for the brand faithful.",
                "img_name": "hiroshyma_tee.jpg",
                "featured": True
            },
            {
                "name": "Mroka Doha Graphic Tee",
                "category": tee_cat,
                "price": "1800.00",
                "sizes": ["S", "M", "L", "XL"],
                "description": "Black tee featuring the Mroka Doha typographic print. Minimalist but striking streetwear aesthetic.",
                "img_name": "mroka_tee.jpg",
                "featured": False
            },
            {
                "name": "Mint Embroidered Sweatpants",
                "category": bottoms_cat,
                "price": "2500.00",
                "sizes": ["M", "L", "XL"],
                "description": "Mint green sweatpants with an embroidered side logo. Heavyweight fleece interior for maximum comfort.",
                "img_name": "mint_pants.jpg",
                "featured": True
            },
            {
                "name": "Black Street Slides",
                "category": footwear_cat,
                "price": "1500.00",
                "sizes": ["40", "41", "42", "43", "44"],
                "description": "Monochrome black slides. Essential styling context for the Hiroshyma.Oyk aesthetic.",
                "img_name": "black_slides.jpg",
                "featured": False
            }
        ]

        # 3. Create Products and Attach Images
        for item in products:
            product, created = Product.objects.get_or_create(
                name=item["name"],
                defaults={
                    "category": item["category"],
                    "price": item["price"],
                    "available_sizes": item["sizes"],
                    "description": item["description"],
                    "is_active": True,
                    "is_featured": item["featured"]
                }
            )

            if created:
                self.stdout.write(f"Created Product: {product.name}")
                
                # Attach Image
                img_path = os.path.join(media_temp, item["img_name"])
                if os.path.exists(img_path):
                    with open(img_path, 'rb') as f:
                        if not ProductImage.objects.filter(product=product).exists():
                            ProductImage.objects.create(
                                product=product,
                                image=File(f, name=item["img_name"]),
                                alt_text=product.name
                            )
                    self.stdout.write(f"  -> Attached image: {item['img_name']}")
                else:
                    self.stdout.write(self.style.WARNING(f"  -> Image not found at {img_path}. Upload manually via Admin."))
            else:
                self.stdout.write(f"Product already exists, skipping: {product.name}")

        self.stdout.write(self.style.SUCCESS('Seed complete!'))
