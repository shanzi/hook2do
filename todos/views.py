from rest_framework import viewsets

from .serializers import ToDoItemList, ToDoItem

class ToDoItemListViewSets(viewsets.ModelViewSet):

    """API viewsets to retrieve and modify ToDoItemList"""
    serializer_class = ToDoItemList

    def get_queryset(self):
        return self.request.user.lists.all()


class ToDoItemViewSets(viewsets.ModelViewSet):

    """API viewsets to retrieve and modify ToDoItem"""
    serializer_class = ToDoItem

    def get_queryset(self):
        return self.request.user.todos.all()
