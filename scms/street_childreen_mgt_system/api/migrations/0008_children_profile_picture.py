# Generated by Django 5.0.4 on 2024-05-04 11:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_children_identity'),
    ]

    operations = [
        migrations.AddField(
            model_name='children',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to='children/images'),
        ),
    ]