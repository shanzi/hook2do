from rest_framework import serializers

from .models import ToDoItemList, ToDoItem

class ToDoItemListSerializer(serializers.ModelSerializer):

    class Meta:
        model = ToDoItemList


class ToDoItemListSerializer(serializers.ModelSerializer):

    class Meta:
        model = ToDoItem
