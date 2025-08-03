from rest_framework import serializers

# Serializer sederhana untuk Hello World
class HelloWorldSerializer(serializers.Serializer):
    """
    Serializer untuk response Hello World - Sederhana dan mudah dipahami
    """
    message = serializers.CharField(max_length=200)
    status = serializers.CharField(max_length=50)
    timestamp = serializers.DateTimeField()

# Serializer untuk informasi API
class APIInfoSerializer(serializers.Serializer):
    """
    Serializer untuk informasi API - Struktur data yang jelas
    """
    api_name = serializers.CharField(max_length=100)
    version = serializers.CharField(max_length=20)
    description = serializers.CharField(max_length=300)
    total_endpoints = serializers.IntegerField()
    
# Serializer untuk response sukses umum
class SuccessResponseSerializer(serializers.Serializer):
    """
    Serializer untuk response sukses - Template yang bisa digunakan berulang
    """
    success = serializers.BooleanField()
    message = serializers.CharField(max_length=200)
    data = serializers.DictField(required=False)
