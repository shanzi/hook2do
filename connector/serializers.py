from rest_framework import serializers

from .models import ResourceChannel


class ResourceChannelSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResourceChannel
        exclude = ('token', )


class ResourceChannelListSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResourceChannel