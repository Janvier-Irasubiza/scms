# Generated by Django 5.0.4 on 2024-05-30 16:17

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0045_alter_testimonial_status_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='opportunity',
            name='status',
            field=models.CharField(default='available', max_length=10),
        ),
        migrations.AlterField(
            model_name='opportunity',
            name='updated_on',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='testimonial',
            name='posted_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
    ]