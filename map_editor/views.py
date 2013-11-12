from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest

import json
import os.path

def home( request ):

    return render( request, 'map_editor.html' )


def saveMap( request ):

    data = request.POST.get( 'data', '' )

    try:
        dataJson = json.loads( data )

    except ValueError as error:
        return HttpResponseBadRequest( 'Invalid JSON:', error )

    filePath = os.path.abspath( '../maps/{}.json'.format( dataJson[ 'mapName' ] ) )

    with open( filePath, 'w', encoding= 'utf-8' ) as f:
        f.write( json.dumps( dataJson, indent= 4 ) )

    return HttpResponse()



def loadMap( request ):

    mapName = request.POST.get( 'mapName' )

    filePath = os.path.abspath( '../maps/{}.json'.format( mapName ) )

    try:
        with open( filePath, 'r', encoding= 'utf-8' ) as f:
            content = f.read()

    except FileNotFoundError as error:

        print( error )
        return HttpResponseBadRequest( "Couldn't find the map:", error )


    return HttpResponse( json.dumps( content ), mimetype= 'application/json' )
