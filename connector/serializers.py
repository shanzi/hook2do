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
    status = serializers.CharField(max_length=16, source='status')

    class Meta:
        model = ResourceIdMapping
        exclude = ('owner', 'todoItem')


class ResourceToDoItemUpdateSerializer(serializers.ModelSerializer):

    content = serializers.CharField(max_length=1024, source='content')
    status = serializers.CharField(max_length=16, source='status', default='default')

    class Meta:
        model = ResourceIdMapping
        exclude = ('owner', 'todoItem', 'resource_id')