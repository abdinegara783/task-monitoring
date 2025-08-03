from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .serializers import (
    HelloWorldSerializer, 
    APIInfoSerializer, 
    SuccessResponseSerializer,
    UserDataSerializer,
    UserListSerializer
)

# Simulasi database sederhana untuk user (dalam aplikasi nyata gunakan model Django)
USERS_DB = [
    {'id': 1, 'name': 'John Doe', 'email': 'john@example.com', 'age': 25, 'city': 'Jakarta'},
    {'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com', 'age': 30, 'city': 'Bandung'},
    {'id': 3, 'name': 'Bob Wilson', 'email': 'bob@example.com', 'age': 28, 'city': 'Surabaya'},
]

@api_view(['GET'])
def hello_world(request):
    """
    API endpoint sederhana untuk Hello World
    Menggunakan serializer untuk memvalidasi dan memformat data
    """
    # Data yang akan dikirim
    data = {
        'message': 'Hello World from Django!',
        'status': 'success',
        'timestamp': timezone.now()
    }
    
    # Gunakan serializer untuk memvalidasi data
    serializer = HelloWorldSerializer(data=data)
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Data tidak valid'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def api_info(request):
    """
    API endpoint untuk informasi API
    Contoh penggunaan serializer untuk data yang lebih kompleks
    """
    # Data informasi API
    data = {
        'api_name': 'Task Monitoring API',
        'version': '1.1.0',
        'description': 'Backend API sederhana untuk belajar Django REST Framework dengan User Management',
        'total_endpoints': 7
    }
    
    # Gunakan serializer untuk memformat data
    serializer = APIInfoSerializer(data=data)
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Data tidak valid'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def test_post(request):
    """
    Contoh endpoint POST sederhana
    Untuk belajar menerima data dari frontend
    """
    # Ambil data dari request
    received_data = request.data
    
    # Buat response sukses
    response_data = {
        'success': True,
        'message': f'Data berhasil diterima: {received_data}',
        'data': received_data
    }
    
    # Gunakan serializer untuk response
    serializer = SuccessResponseSerializer(data=response_data)
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Response tidak valid'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_users(request):
    """
    Endpoint untuk mendapatkan daftar semua user
    Contoh penggunaan serializer untuk data list
    """
    # Data untuk response
    response_data = {
        'total_users': len(USERS_DB),
        'users': USERS_DB,
        'page_info': {
            'current_page': 1,
            'total_pages': 1,
            'has_next': False
        }
    }
    
    # Gunakan serializer untuk memvalidasi struktur data
    serializer = UserListSerializer(data=response_data)
    if serializer.is_valid():
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Data tidak valid', 'details': serializer.errors}, 
                       status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_user(request):
    """
    Endpoint untuk membuat user baru
    Contoh validasi input dengan serializer
    """
    # Validasi data input dengan serializer
    serializer = UserDataSerializer(data=request.data)
    
    if serializer.is_valid():
        # Simulasi menyimpan ke database
        new_user = serializer.validated_data
        new_user['id'] = len(USERS_DB) + 1
        USERS_DB.append(new_user)
        
        # Response sukses
        response_data = {
            'success': True,
            'message': f'User {new_user["name"]} berhasil dibuat',
            'data': new_user
        }
        
        response_serializer = SuccessResponseSerializer(data=response_data)
        if response_serializer.is_valid():
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    # Jika validasi gagal, kembalikan error
    return Response({
        'success': False,
        'message': 'Data tidak valid',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_user_by_id(request, user_id):
    """
    Endpoint untuk mendapatkan user berdasarkan ID
    Contoh parameter URL dan error handling
    """
    try:
        # Cari user berdasarkan ID
        user = next((u for u in USERS_DB if u['id'] == int(user_id)), None)
        
        if user:
            # Validasi data user dengan serializer
            serializer = UserDataSerializer(data=user)
            if serializer.is_valid():
                return Response({
                    'success': True,
                    'message': 'User ditemukan',
                    'data': serializer.data
                }, status=status.HTTP_200_OK)
        
        # User tidak ditemukan
        return Response({
            'success': False,
            'message': f'User dengan ID {user_id} tidak ditemukan'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except ValueError:
        return Response({
            'success': False,
            'message': 'ID user harus berupa angka'
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_user(request, user_id):
    """
    Endpoint untuk menghapus user
    Contoh operasi DELETE dengan validasi
    """
    try:
        # Cari index user berdasarkan ID
        user_index = next((i for i, u in enumerate(USERS_DB) if u['id'] == int(user_id)), None)
        
        if user_index is not None:
            deleted_user = USERS_DB.pop(user_index)
            
            response_data = {
                'success': True,
                'message': f'User {deleted_user["name"]} berhasil dihapus',
                'data': deleted_user
            }
            
            serializer = SuccessResponseSerializer(data=response_data)
            if serializer.is_valid():
                return Response(serializer.data, status=status.HTTP_200_OK)
        
        # User tidak ditemukan
        return Response({
            'success': False,
            'message': f'User dengan ID {user_id} tidak ditemukan'
        }, status=status.HTTP_404_NOT_FOUND)
        
    except ValueError:
        return Response({
            'success': False,
            'message': 'ID user harus berupa angka'
        }, status=status.HTTP_400_BAD_REQUEST)