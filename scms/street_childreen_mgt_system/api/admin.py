from django.contrib import admin
from django.contrib.auth.models import Group
from .models import Sector, Cell, User, UserActivity, Children, Family, Case, Opportunity, Testimonial

admin.site.register([Sector, Cell, User, UserActivity, Children, Family, Case, Opportunity, Testimonial])
admin.site.unregister([Group])