from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django.db import IntegrityError

from todos.models import ToDoItemList
from .models import ResourceChannel, ResourceIdMapping
from .serializers import ResourceChannelSerializer, ResourceChannelListSerializer, \
    ResourceToDoItemSerializer, ResourceToDoItemForOthersSerializer, ResourceToDoItemUpdateSerializer


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

    lookup_value_regex = '.{1,32}'

    permission_classes = (AllowAny,)

    def create(self, request, *args, **kwargs):
        try:
            serializer = ResourceToDoItemForOthersSerializer(data=request.DATA)
            if serializer.is_valid():
                m = ResourceIdMapping.create(kwargs["token"],
                                             serializer.data["resource_id"],
                                             serializer.data["content"])
                serializer = ResourceToDoItemForOthersSerializer(m)
                return Response(serializer.data)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        try:
            m = ResourceIdMapping.get(kwargs['token'], kwargs['resource_id'])
            serializer = ResourceToDoItemForOthersSerializer(m)
            return Response(serializer.data)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def list(self, request, *args, **kwargs):
        try:
            m = ResourceIdMapping.list(kwargs['token'])
            serializer = ResourceToDoItemForOthersSerializer(m, many=True)
            return Response(serializer.data)
        except:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def update(self, request, *args, **kwargs):
        try:
            serializer = ResourceToDoItemUpdateSerializer(data=request.DATA)
            if serializer.is_valid():
                m = ResourceIdMapping.get(kwargs["token"],
                                          kwargs["resource_id"])
                m.todoItem.content = serializer.data["content"]
                m.todoItem.status = serializer.data["status"]
                m.todoItem.save()
                serializer = ResourceToDoItemForOthersSerializer(m)
                return Response(serializer.data)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)