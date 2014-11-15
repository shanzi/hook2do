from rest_framework import viewsets, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from todos.models import ToDoItemList
from .models import ResourceChannel, ResourceIdMapping
from .serializers import ResourceChannelSerializer, ResourceChannelListSerializer, ResourceToDoItemSerializer


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
                serializer = ResourceChannelListSerializer(resource_channel)
                return Response(serializer.data)
            return Response(status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def list(self, request, *args, **kwargs):
        serializer = ResourceChannelListSerializer(self.queryset, many=True)
        return Response(serializer.data)


class ResourceToDoItemViewSet(viewsets.ModelViewSet):

    serializer_class = ResourceToDoItemSerializer

    queryset = ResourceIdMapping.objects.all()

    lookup_field = 'resource_id'

    lookup_value_regex = '[0-9a-f]{1,32}'