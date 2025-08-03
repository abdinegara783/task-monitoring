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

# Serializer untuk data user sederhana
class UserDataSerializer(serializers.Serializer):
    """
    Serializer untuk data user - Contoh validasi input yang lebih kompleks
    """
    name = serializers.CharField(max_length=100, help_text="Nama lengkap user")
    email = serializers.EmailField(help_text="Email yang valid")
    age = serializers.IntegerField(min_value=1, max_value=120, help_text="Umur antara 1-120")
    city = serializers.CharField(max_length=50, required=False, help_text="Kota asal (opsional)")
    
    def validate_name(self, value):
        """
        Validasi custom untuk nama - tidak boleh hanya angka
        """
        if value.isdigit():
            raise serializers.ValidationError("Nama tidak boleh hanya berisi angka")
        return value

# Serializer untuk list user
class UserListSerializer(serializers.Serializer):
    """
    Serializer untuk menampilkan daftar user
    """
    total_users = serializers.IntegerField()
    users = UserDataSerializer(many=True)
    page_info = serializers.DictField(required=False)
