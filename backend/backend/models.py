from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    ROLE_CHOICES = [
        ("employee", "Employee"),
        ("foreman", "Foreman"),
        ("admin", "Admin"),
    ]

    SHIFT_CHOICES = [
        ("1", "Shift 1 (07:00 - 15:00)"),
        ("2", "Shift 2 (15:00 - 23:00)"),
    ]

    employee_id = models.CharField(max_length=20, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="employee")
    shift = models.CharField(
        max_length=10, choices=SHIFT_CHOICES, null=True, blank=True
    )
    is_on_leave = models.BooleanField(default=False)
    # telegram_id = models.CharField (max_length= 20, null=True, blank = True)
    # whatsapp_number = models.CharField(max_length = 20, null = True, blank = True)
    # created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)

    # Fix reverse accessor conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to.',
        related_name='custom_user_set',
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name='custom_user_set',
        related_query_name='custom_user',
    )

    def __str__(self):
        return f"{self.employee_id} - {self.get_full_name()}"
