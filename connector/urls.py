from django.conf.urls import patterns, include, url

from rest_framework.routers import DefaultRouter

from .views import ResourceChannelViewSet, ResourceChannelListViewSet

router = DefaultRouter()

router.register('register', ResourceChannelViewSet, base_name='register')
router.register('list', ResourceChannelListViewSet, base_name='list')

urlpatterns = patterns(
    '', 
    url(r'', include(router.urls)),
)
