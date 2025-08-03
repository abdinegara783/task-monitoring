from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .serializers import HelloWorldSerializer, APIInfoSerializer, SuccessResponseSerializer

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
        'version': '1.0.0',
        'description': 'Backend API sederhana untuk belajar Django REST Framework',
        'total_endpoints': 2
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