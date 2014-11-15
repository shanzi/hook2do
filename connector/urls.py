from django.conf.urls import patterns, include, url

from rest_framework.routers import DefaultRouter

from .views import ResourceChannelViewSet, ResourceToDoItemViewSet

router = DefaultRouter()

router.register('channels', ResourceChannelViewSet, base_name='channels')
router.register('todos/(?P<token>.{1,32})', ResourceToDoItemViewSet, base_name='todos')

urlpatterns = patterns(
    '', 
    url(r'', include(router.urls)),
)
