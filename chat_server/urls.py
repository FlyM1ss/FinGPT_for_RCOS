"""
URL configuration for chat_server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from chat_server_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('get_number', views.Get_A_Number, name='get_number'),
    path('get_chat_response/', views.chat_response, name='get_chat_response'),
    path('input_webtext/', views.add_webtext, name='input_webtext'),
    path('get_adv_response/', views.adv_response, name='get_adv_response'),
    path('clear_messages/', views.clear, name = 'clear_messages'),
    path('get_source_urls/', views.get_sources, name = 'get_source_urls'),
    path('log_question/', views.log_question, name='log_question'),
    path('api/get_preferred_urls/', views.get_preferred_urls, name='get_preferred_urls'),
    path('api/add_preferred_url/', views.add_preferred_url, name='add_preferred_url'),
    path('upload_file/', views.upload_file, name='upload_file')

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
