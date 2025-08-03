"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views

# URL patterns sederhana - mudah dipahami pemula
urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints sederhana
    path('api/hello/', views.hello_world, name='hello_world'),
    path('api/info/', views.api_info, name='api_info'),
    path('api/test-post/', views.test_post, name='test_post'),
    
    # User Management endpoints - Contoh CRUD sederhana
    path('api/users/', views.get_users, name='get_users'),                    # GET - Daftar semua user
    path('api/users/create/', views.create_user, name='create_user'),         # POST - Buat user baru
    path('api/users/<int:user_id>/', views.get_user_by_id, name='get_user'),  # GET - User berdasarkan ID
    path('api/users/<int:user_id>/delete/', views.delete_user, name='delete_user'),  # DELETE - Hapus user
]
