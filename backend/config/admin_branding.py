"""
Admin branding — import this from config/urls.py (see the updated urls.py)
so the admin panel Kevin logs into daily says "Hiroshyma.Oyk" instead of
the default "Django administration".
"""

from django.contrib import admin

admin.site.site_header = "Hiroshyma.Oyk Admin"
admin.site.site_title = "Hiroshyma.Oyk"
admin.site.index_title = "Store Management"
