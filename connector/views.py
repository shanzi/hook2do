from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from todos.models import ToDoItemList
from .models import ResourceChannel
from .serializers import ResourceChannelSerializer, ResourceChannelListSerializer


class ResourceChannelViewSet(viewsets.ModelViewSet):

    serializer_class = ResourceChannelSerializer

    queryset = ResourceChannel.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            serializer = ResourceChannelSerializer(data=request.DATA)
            if serializer.is_valid():
                lst_id = serializer.data["todoList"]
                lst = get_object_or_404(ToDoItemList, pk=lst_id)
                resource_channel = ResourceChannel.bind_a_list(lst)
                serializer = ResourceChannelSerializer(resource_channel)
                return Response(serializer.data)
            return Response(status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)


class ResourceChannelListViewSet(viewsets.ModelViewSet):

    serializer_class = ResourceChannelListSerializer

    queryset = ResourceChannel.objects.all()