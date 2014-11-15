from rest_framework import serializers

from todos.models import ToDoItem
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