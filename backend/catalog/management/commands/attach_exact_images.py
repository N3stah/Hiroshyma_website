import os
import shutil
from django.core.management.base import BaseCommand
from catalog.models import Product, ProductImage
from django.core.files import File

class Command(BaseCommand):
    help = 'Explicitly attaches known filenames to products and moves logo'

    def handle(self, *args, **options):
        base_path = os.path.join('media', 'temp', 'SHOP_Images')
        
        mappings = {
            "white_shirt.jpeg": "Hiroshyma EST 2009 Graphic Tee",
            "black_shirt.jpeg": "Notorious B.I.G. Graphic Tee",
            "black_shirtt.jpeg": "Mroka Doha Graphic Tee",
        }

        for filename, prod_name in mappings.items():
            filepath = os.path.join(base_path, filename)
            if os.path.exists(filepath):
                product = Product.objects.filter(name__icontains=prod_name).first()
                if product:
                    # Delete old images to prevent duplicates
                    ProductImage.objects.filter(product=product).delete()
                    with open(filepath, 'rb') as f:
                        ProductImage.objects.create(
                            product=product,
                            image=File(f, name=filename),
                            alt_text=product.name
                        )
                    self.stdout.write(self.style.SUCCESS(f'Attached "{filename}" to "{product.name}"'))
            else:
                self.stdout.write(self.style.WARNING(f'File not found: {filename}'))

        # Handle the Logo file
        logo_src = os.path.join(base_path, 'LOGO.jpeg')
        logo_dest_dir = os.path.join('..', 'frontend', 'public')
        logo_dest = os.path.join(logo_dest_dir, 'logo.jpeg')
        
        if os.path.exists(logo_src):
            os.makedirs(logo_dest_dir, exist_ok=True)
            shutil.copy(logo_src, logo_dest)
            self.stdout.write(self.style.SUCCESS('Copied LOGO.jpeg to frontend/public/logo.jpeg for future use'))
            
        # Handle Black Street Slides if there's a remaining image, else leave it
        # (Assuming 'trouser.jpeg' might have been the slides or a duplicate, 
        # we will just leave them as is for now or upload manually later)

        self.stdout.write(self.style.SUCCESS('Exact attachment process complete.'))
