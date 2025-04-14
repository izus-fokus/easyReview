from django.contrib import admin

from .models import Message, Review, Reviewer, Field, Metadatablock, Compound, File

# Register your models here.
admin.site.register(Review)
admin.site.register(Reviewer)
admin.site.register(Metadatablock)
admin.site.register(Field)
admin.site.register(Compound)
admin.site.register(File)
admin.site.register(Message)
