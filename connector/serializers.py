from rest_framework import serializers

from .models import ResourceChannel, ResourceIdMapping


class ResourceChannelSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResourceChannel
        exclude = ('token', )


class ResourceChannelListSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResourceChannel


class ResourceToDoItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResourceIdMapping


class ResourceToDoItemForOthersSerializer(serializers.ModelSerializer):

    token = serializers.CharField(max_length=32, source='token')
    content = serializers.CharField(max_length=1024, source='content')

    class Meta:
        model = ResourceIdMapping
        exclude = ('owner', 'todoItem')