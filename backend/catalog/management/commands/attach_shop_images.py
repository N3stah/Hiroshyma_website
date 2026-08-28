import os
from django.core.management.base import BaseCommand
from catalog.models import Product, ProductImage
from django.core.files import File

class Command(BaseCommand):
    help = 'Attaches images from media/temp/SHOP_Images/ to the seeded products'

    def handle(self, *args, **options):
        folder_path = os.path.join('media', 'temp', 'SHOP_Images')
        
        if not os.path.exists(folder_path):
            self.stdout.write(self.style.ERROR(f'Folder not found: {folder_path}'))
            return

        files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
        if not files:
            self.stdout.write(self.style.ERROR(f'No images found in {folder_path}'))
            return

        self.stdout.write(f"Found {len(files)} files. Attempting to attach...")

        # Keyword mapping to product name
        mappings = [
            (["big", "notorious"], "Notorious B.I.G. Graphic Tee"),
            (["hiro", "est"], "Hiroshyma EST 2009 Graphic Tee"),
            (["mroka", "doha"], "Mroka Doha Graphic Tee"),
            (["mint", "pant", "green"], "Mint Embroidered Sweatpants"),
            (["slide", "sneaker", "shoe"], "Black Street Slides"),
        ]

        for filename in files:
            lower_filename = filename.lower()
            matched_product = None
            
            for keywords, prod_name in mappings:
                if any(keyword in lower_filename for keyword in keywords):
                    matched_product = Product.objects.filter(name__icontains=prod_name).first()
                    break
            
            if matched_product:
                # Delete old images first to avoid duplicates if run multiple times
                ProductImage.objects.filter(product=matched_product).delete()
                
                filepath = os.path.join(folder_path, filename)
                with open(filepath, 'rb') as f:
                    ProductImage.objects.create(
                        product=matched_product,
                        image=File(f, name=filename),
                        alt_text=matched_product.name
                    )
                self.stdout.write(self.style.SUCCESS(f'Attached "{filename}" to "{matched_product.name}"'))
            else:
                self.stdout.write(self.style.WARNING(f'Could not match "{filename}" to any product. You will need to upload this manually via Django Admin.'))

        self.stdout.write(self.style.SUCCESS('Image attachment process finished.'))
