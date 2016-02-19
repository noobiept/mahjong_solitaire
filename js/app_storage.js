/*global chrome*/

var AppStorage;
(function(AppStorage) {


/**
 * Calls the `callback` with a dictionary that has all the requested keys/values from `localStorage`.
 */
function get_localStorage( keys, callback )
    {
    var objects = {};

    for (var a = 0 ; a < keys.length ; a++)
        {
        var key = keys[ a ];
        var value = localStorage.getItem( key );

        objects[ key ] = value && JSON.parse( value );
        }

    callback( objects );
    }


/**
 * Sets the given key/value into `localStorage`. Calls the `callback` when its done.
 * Converts the value to string (with json).
 */
function set_localStorage( items, callback )
    {
    for ( var key in items )
        {
        if ( items.hasOwnProperty( key ) )
            {
            localStorage.setItem( key, JSON.stringify( items[ key ] ) );
            }
        }

    if ( callback )
        {
        callback();
        }
    }


/**
 * Remove the given keys from `localStorage`.
 */
function remove_localStorage( items, callback )
    {
    for ( var key in items )
        {
        if ( items.hasOwnProperty( key ) )
            {
            localStorage.removeItem( key );
            }
        }

    if ( callback )
        {
        callback();
        }
    }


/**
 * Calls the `callback` with a dictionary that has all the requested keys/values from `chrome.storage.local`.
 */
function get_chromeStorage( keys, callback )
    {
    chrome.storage.local.get( keys, callback );
    }


/**
 * Sets the given key/value into `chrome.storage.local`. Calls the `callback` when its done.
 * Converts the value to string (with json).
 */
function set_chromeStorage( items, callback )
    {
    chrome.storage.local.set( items, callback );
    }


/**
 * Remove the given keys from `chrome.storage.local`.
 */
function remove_chromeStorage( items, callback )
    {
    chrome.storage.local.remove( items, callback );
    }


/**
 * Uses the `chrome storage` if it's available (when running as a chrome app), otherwise uses the `localStorage`.
 */
AppStorage.getData = function( keys, callback )
    {
    if ( window.chrome && window.chrome.storage )
        {
        get_chromeStorage( keys, callback );
        }

    else
        {
        get_localStorage( keys, callback );
        }
    };


/**
 * Uses the `chrome storage` if it's available (when running as a chrome app), otherwise uses the `localStorage`.
 */
AppStorage.setData = function( items, callback )
    {
    if ( window.chrome && window.chrome.storage )
        {
        set_chromeStorage( items, callback );
        }

    else
        {
        set_localStorage( items, callback );
        }
    };


/**
 * Uses the `chrome storage` if it's available (when running as a chrome app), otherwise uses the `localStorage`.
 */
AppStorage.removeData = function( items, callback )
    {
    if ( window.chrome && window.chrome.storage )
        {
        remove_chromeStorage( items, callback );
        }

    else
        {
        remove_localStorage( items, callback );
        }
    };


})(AppStorage || (AppStorage = {}));
