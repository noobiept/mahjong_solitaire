from django.conf.urls import include, url
import views


urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^save_map/?$', views.saveMap, name='saveMap'),
    url(r'^load_map/?$', views.loadMap, name='loadMap'),
]