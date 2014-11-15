from rest_framework import viewsets, status
from rest_framework.decorators import detail_route
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import ToDoItem, TimeLogEntry
from .serializers import ToDoItemListSerializer, ToDoItemSerializer, TimeLogEntrySerializer



class ToDoItemListViewSet(viewsets.ModelViewSet):

    """API viewsets to retrieve and modify ToDoItemList"""
    serializer_class = ToDoItemListSerializer

    def get_queryset(self):
        return self.request.user.lists.all()

    def pre_save(self, obj):
        obj.owner = self.request.user


class ToDoItemViewSet(viewsets.ModelViewSet):

    """API viewsets to retrieve and modify ToDoItem"""
    serializer_class = ToDoItemSerializer

    def get_queryset(self):
        return self.request.user.todos.order_by('-created_at').all()

    def pre_save(self, obj):
        obj.owner = self.request.user

    @detail_route(methods=['get'])
    def start_tracking(self, request, pk=None):
        item = get_object_or_404(ToDoItem, pk=pk)
        log_entry = TimeLogEntry.get_started(item)
        if not log_entry:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = TimeLogEntrySerializer(log_entry)
        return Response(serializer.data)

    @detail_route(methods=['get'])
    def end_tracking(self, request, pk=None):
        item = get_object_or_404(ToDoItem, pk=pk)
        log_entry = TimeLogEntry.finish(item)
        if not log_entry:
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = TimeLogEntrySerializer(log_entry)
        return Response(serializer.data)


class TimeLogEntryViewSet(viewsets.ModelViewSet):

    queryset = TimeLogEntry.objects.all()

    serializer_class = TimeLogEntrySerializer
