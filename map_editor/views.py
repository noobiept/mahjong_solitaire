from django.shortcuts import render

def home( request ):

    return render( request, 'map_editor.html' )