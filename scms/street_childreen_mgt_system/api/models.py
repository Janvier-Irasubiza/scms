from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from django.utils.text import slugify
import random
import string
import uuid

ChildrenStatuses = (
    ("In school", "In school"),
    ("In transit centre", "In transit centre"),
    ("In rehabilitation center", "In rehabilitation center"),
    ("Re-integrated in family", "Re-integrated in family"),
    ("In street", "In street"),
    ("Rehabilitated", "Rehabilitated")
)

FamilyStatuses = (
    ("Critical", "Critical"),
    ("Improving", "Improving"),
    ("Cleared", "Cleared"),
    ("Dangerous", "Dangerous")
)

class Sector(models.Model):
    sectorname = models.CharField(max_length=100)
    executive_officer = models.CharField(max_length=300)

    def __str__(self):
        return self.sectorname

class Cell(models.Model):
    cellname = models.CharField(max_length=100)
    executive_officer = models.CharField(max_length=300)
    sector = models.ForeignKey(Sector, on_delete=models.RESTRICT)

    def __str__(self):
        return self.cellname

class User(AbstractUser): 
    user_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    username = models.CharField(max_length=100, unique=True)
    phone = models.CharField(max_length=15)
    identity = models.CharField(max_length=16)
    gender = models.CharField(max_length=10)
    age = models.IntegerField(null=True, blank=True)
    responsability = models.CharField(max_length=100)
    privilege = models.CharField(max_length=100, choices=[('cellular', 'Cellular'), ('superuser', 'Superuser'), ('sectorial', 'Sectorial'), ('rehab', 'Rehab')])
    residential_address = models.CharField(max_length=200, null=True, blank=True)
    office_sector = models.ForeignKey(Sector, on_delete=models.RESTRICT, null=True, blank=True)
    office_cell = models.ForeignKey(Cell, on_delete=models.RESTRICT, null=True, blank=True)
    password = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.pk:  
            if self.password == "":
                url = f'http://localhost:5173/change-password/${self.user_uuid}'
            else: 
                self.password = make_password(self.password)

        if self.is_superuser:
            self.privilege = 'superuser'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class UserActivity(models.Model):
    activity = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    done_at = models.DateTimeField(auto_now_add=True) 

    def __str__(self):
        return self.activity
    
    class Meta:
        verbose_name_plural = 'UserActivities'

class Family(models.Model):
    fathernames = models.CharField(max_length=100)
    mothernames = models.CharField(max_length=100)
    mariage_status = models.CharField(max_length=20)
    district = models.CharField(max_length=50)
    sector = models.CharField(max_length=50)
    cell = models.CharField(max_length=50)
    village =  models.CharField(max_length=50)
    status = models.CharField(max_length=50, choices=FamilyStatuses, default='Critical')
    about_family = models.TextField(max_length=1000, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.fathernames
    
    class Meta:
        verbose_name_plural = "Families"

class Children(models.Model):
    firstname = models.CharField(max_length=100)
    lastname = models.CharField(max_length=100)
    identity = models.CharField(max_length=16, null=True, blank=True)
    gender = models.CharField(max_length=10)
    age = models.IntegerField()
    family = models.ForeignKey(Family, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=100, choices=ChildrenStatuses, default="In street")
    behavior = models.CharField(max_length=100, null=True, blank=True)
    behavior_desc = models.TextField(max_length=1000, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='children/images', null=True, blank=True)

    def __str__(self):
        return f"{self.firstname} {self.lastname}"
    
    class Meta:
        verbose_name_plural = 'Children'

class Case(models.Model):
    case_code = models.CharField(max_length=100, unique=True, editable=False, blank=True)
    child = models.ForeignKey(Children, on_delete=models.RESTRICT)
    reason_of_capture = models.CharField(max_length=1000)
    district_of_capture = models.CharField(max_length=50)
    sector_of_capture = models.ForeignKey(Sector, on_delete=models.RESTRICT)
    cell_of_capture = models.ForeignKey(Cell, on_delete=models.RESTRICT)
    village_of_capture =  models.CharField(max_length=50)
    date_of_capture = models.DateTimeField()
    orientation = models.CharField(max_length=100)
    case_desc = models.TextField()
    reported_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.case_code:
            sector_code = self.sector_of_capture.sectorname[:3].upper()
            cell_code = self.cell_of_capture.cellname[:3].upper()
            latest_case_number = Case.objects.filter(sector_of_capture=self.sector_of_capture, cell_of_capture=self.cell_of_capture).count() + 1
            random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
            self.case_code = f"RW-{sector_code}{cell_code}-{random_string}{latest_case_number:03}"
        super().save(*args, **kwargs)
        
        
    def __str__(self):
        return self.case_code

class Opportunity(models.Model):
    title = models.CharField(max_length=100)
    slag = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    poster = models.ImageField(upload_to='posts/images/', null=True, blank=True)
    priority = models.CharField(max_length=50, default='general')
    posted_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, default="available")
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    sector = models.ForeignKey(Sector, on_delete=models.CASCADE, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        self.slag = slugify(self.title)
        self.sector = self.posted_by.office_sector if self.posted_by else None
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name_plural = 'Opportunities'

class Testimonial(models.Model):
    title = models.CharField(max_length=100)
    slag = models.CharField(max_length=100, blank=True)
    description = models.TextField()
    poster = models.ImageField(upload_to='posts/images/', null=True, blank=True)
    video = models.FileField(upload_to='posts/videos/', null=True, blank=True)
    priority = models.CharField(max_length=50, default='general')
    posted_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, default="available")
    posted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    sector = models.ForeignKey(Sector, on_delete=models.CASCADE, null=True, blank=True)
    speaker = models.CharField(max_length=200)
    
    def save(self, *args, **kwargs):
        self.slag = slugify(self.title)
        self.sector = self.posted_by.office_sector if self.posted_by else None
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title