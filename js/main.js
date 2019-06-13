var map;
var firstRun = true;
var parsedData;
var coords = [];
var url;
var parsedData;

var addDialog = false;

var tbVisible = false;

var shareURL = '/index.html';
var dataDir = 'datafiles/';

var atsiVisible = true;

var deltaDistance = 100;
var deltaDegrees = 10;
var walking = false;

var curStyle = mbStyleLight;
//
$(document).ready(function () {

    if (window.matchMedia('(display-mode: standalone)').matches) {
        $('.mapbox-ctrl-top-right').css('margin-top', '20pt');
    }

    $('.mapboxgl-ctrl-top-left').append('#aboutOverlay');

    $('#tourbarButtons').hide();

    // Clear the search box (in case the value was saved across sessions).
    $('#textSearch').val('');

    $('#pointLoadingInfo').show();

    // Load up Mapbox GL - access token and the main map element.
    // The default style is a plain white one. 
    // Note: If you're rolling your own Topomapper instance, you'll need to change the token and style.
    mapboxgl.accessToken = mbToken;
    map = new mapboxgl.Map({
        container: 'map', // container id
        style: mbStyleLight,
        center: [146.814329, -19.258181],
        zoom: 13,
        attributionControl: false
    });

    map.addControl(new mapboxgl.AttributionControl({
        compact: false
    }), 'bottom-right');

    map.addControl(new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
    }), 'top-right');

    // Add geolocate control to the map.
    map.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }), 'top-left');

    map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    // Here, we're executing a few things once the map is loaded.
    map.on('load', function () {

        getData();
        
        map.resize();
    });


    map.on('click', function (e) {
        var layerList = ['euExplLayer', 'atsiLayer', 'polLayer', 'busLayer', 'monarLayer', 'relLayer', 'warLayer', 'etcLayer', 'noneLayer'];
        var clickedLayer = map.queryRenderedFeatures(e.point)[0].layer.id;
        if (layerList.indexOf(clickedLayer) > -1) {
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML('<p></p><b>' + map.queryRenderedFeatures(e.point)[0].properties.name + '</b><p>' + map.queryRenderedFeatures(e.point)[0].properties.description + '</p><p><b>References</b><br \\>' + map.queryRenderedFeatures(e.point)[0].properties.refs)
                .addTo(map);
        }

    });
});

function toggleMapLayers() {
    curStyle == mbStyleLight ? curStyle = mbStyleSat : curStyle = mbStyleLight;
    map.setStyle(curStyle);
    map.on('style.load', function(e) {
        getData();
    })
}

function getData() {
    var lineColour = '#30809F';
    var lineWidth = 7;

    map.addSource('euExplSource', {
        type: 'geojson',
        data: dataDir + 'euexpl.json'
    });

    map.addLayer({
        "id": "euExplLayer",
        "type": "line",
        "source": "euExplSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth,
            "line-opacity": 0.4
          }
    });

    map.addSource('localSource', {
        type: 'geojson',
        data: dataDir + 'local.json'
    });

    map.addLayer({
        "id": "localLayer",
        "type": "line",
        "source": "localSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth,
            "line-opacity": 0.4
          }
    });

    map.addSource('polSource', {
        type: 'geojson',
        data: dataDir + 'pol.json'
    });

    map.addLayer({
        "id": "polLayer",
        "type": "line",
        "source": "polSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth,
            "line-opacity": 0.4
          }
    });

    map.addSource('atsiSource', {
        type: 'geojson',
        data: dataDir + 'atsi.json'
    });

    map.addLayer({
        "id": "atsiLayer",
        "type": "line",
        "source": "atsiSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth,
            "line-opacity": 0.4
          }
    });

    map.addSource('busSource', {
        type: 'geojson',
        data: dataDir + 'business.json'
    });

    map.addLayer({
        "id": "busLayer",
        "type": "line",
        "source": "busSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth,
            "line-opacity": 0.4
          }
    });

    map.addSource('monarSource', {
        type: 'geojson',
        data: dataDir + 'monarchy.json'
    });

    map.addLayer({
        "id": "monarLayer",
        "type": "line",
        "source": "monarSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth,
            "line-opacity": 0.4
          }
    });

    map.addSource('relSource', {
        type: 'geojson',
        data: dataDir + 'religious.json'
    });

    map.addLayer({
        "id": "relLayer",
        "type": "line",
        "source": "relSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth,
            "line-opacity": 0.4
          }
    });

    map.addSource('warSource', {
        type: 'geojson',
        data: dataDir + 'war.json'
    });

    map.addLayer({
        "id": "warLayer",
        "type": "line",
        "source": "warSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth,
            "line-opacity": 0.4
          }
    });

    map.addSource('etcSource', {
        type: 'geojson',
        data: dataDir + 'etc.json'
    });

    map.addLayer({
        "id": "etcLayer",
        "type": "line",
        "source": "etcSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth,
            "line-opacity": 0.4
          }
    });

    map.addSource('noneSource', {
        type: 'geojson',
        data: dataDir + 'none.json'
    });

    map.addLayer({
        "id": "noneLayer",
        "type": "line",
        "source": "noneSource",
        "paint": {
            "line-color": "#000000",
            "line-width": lineWidth,
            "line-opacity": 0.4
          }
    });

    $('#pointLoadingInfo').hide();
}

// This is the main geolocation handler.
function centreMap(position) {

    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    // Centre the map on the latitude and longitude.
    map.setCenter([lng, lat]);

    // Set the location input on the add form. This needs to be there so the value is included with the request to add a point.
    $("#textLocation").val(parseFloat(lat).toFixed(7) + ", " + parseFloat(lng).toFixed(7));


    // If this is the first run of the app (for the session), create and add the source and layer that will store the lat and lng of the user's location.
    if (firstRun === true) {
        firstRun = false;

    } else {
        // If we've already added the source and layer (ie. the session has already been established), simply change the data in the source.
        map.getSource('curSource').setData(JSON.parse({
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [position.coords.longitude, position.coords.latitude]
                },
                'properties': {
                    'description': '<br \\>Your Current Location',
                    'icon': 'circle-stroked'
                }
            }]
        }));
    }

    // Return the location of the user.
    return [lng, lat];
}

// Toggle the side menu that contains the points info including story and tag info and picture (if applicable).
function toggleMenu() {
    // Set the sidebar to overlay the map (the other option is to push the map to the side but that takes away space on smaller screens).
    $('#sideBar')
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('setting', 'mobileTransition', 'overlay')
        .sidebar('toggle');
}

// Toggle the side menu that contains the points info including story and tag info and picture (if applicable).
function toggleOpts() {
    // Set the sidebar to overlay the map (the other option is to push the map to the side but that takes away space on smaller screens).
    $('#menuBar')
        .sidebar('setting', 'transition', 'overlay')
        .sidebar('setting', 'mobileTransition', 'overlay')
        .sidebar('toggle');
}

// Close the add overlay.
function closeAdd() {
    $('#map').css('filter', 'none');
    $('#searchInput').css('filter', 'none');
    $('#addOverlay').css('-webkit-backdrop-filter', 'none');
    $('#toolbarButtons').css('filter', 'none');
    $('#addOverlay').hide();
    //$('#addOverlay').fadeOut('slow');
}

// Close the "first" overlay (the overlay that appears the very first time a user uses HereStory).
function closeFirst() {
    $('#firstOverlay').hide();
}

// Show the add overlay.
function showAdd() {
    // Clear any toasts and tell the user to wait while the points are loading.
    //toastr.clear();
    $('#pointLoadingInfo').hide();
    //toastr.info('Please wait...', 'Finding location');

    // Here, the map is centred on the user.
    // This is a bit of a workaround to ensure that the location input (#textLocation) has the right value.
    //navigator.geolocation.getCurrentPosition(centreMapToolbar);
    $('#addOverlay').show();
    $('#map').css('filter', 'blur(8px)');
    $('#searchInput').css('filter', 'blur(8px)');
    $('#toolbarButtons').css('filter', 'blur(8px)');
    $('#addOverlay').css('-webkit-backdrop-filter', 'blur(8px)');
    addDialog = true;
}

// Show the overlay upload that asks users to wait while a story is uploaded. This is more for circumstances where the user is uploading a picture and thus, the submission of a story may take some time.
function showUploadProgress() {
    $('#uploadOverlay').show();
}

// Close the upload progress dialog.
function closeUploadProgress() {
    $('#uploadOverlay').hide();
}

// This is the click handler for the location button (when the user wants to recentre the map).
function reCentreMap() {
    // Clear any toasts and tell the user to wait while the points are loading.
    //toastr.clear();
    //toastr.info('Please wait...', 'Finding location');
    $('#pointLoadingInfo').hide();
    // Call the handler for the geolocation.
    navigator.geolocation.getCurrentPosition(centreMapToolbar);
}

// The geolocation handler for requests to recentre the map by the user.
function centreMapToolbar(position) {

    var lat = position.coords.latitude;
    var lng = position.coords.longitude;

    map.getSource('curSource').setData({
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lng, lat]
            },
            "properties": {
                "description": "Your Location",
                'icon': 'circle-stroked'
            }
        }]
    });

    // This sets the location of the #textLocation input to the coordinates of the user.
    $("#textLocation").val(parseFloat(lat).toFixed(7) + ", " + parseFloat(lng).toFixed(7));
    // Fly to the user's location.
    map.flyTo({
        center: [lng, lat]
    });
    $('#pointLoadingInfo').hide();
}

function toolbarToggle() {
    if (tbVisible === false) {
        $('#buttonToolbar').show();
        tbVisible = true;
    } else {
        $('#buttonToolbar').hide();
        tbVisible = false;
    }
}

// Close the add overlay.
function closeHelp() {
    $('#helpOverlay').hide();
    //$('#addOverlay').fadeOut('slow');
}

function showHelp() {
    $('#helpOverlay').show();
}

function showShare() {
    $('#shareOverlay').show();
    $('#shareSpan').html('https://www.bryanabsmith.com/topomapper' + shareURL);
    $('#map').css('filter', 'blur(8px)');
    $('#searchInput').css('filter', 'blur(8px)');
    $('#shareOverlay').css('-webkit-backdrop-filter', 'blur(8px)');
}

// Close the share overlay.
function closeShare() {
    $('#shareOverlay').hide();
    $('#map').css('filter', 'none');
    $('#searchInput').css('filter', 'none');
    $('#shareOverlay').css('-webkit-backdrop-filter', 'none');
    //$('#addOverlay').fadeOut('slow');
}

function showLegend() {
    $('#legendOverlay').show();
    $('#toolbarButtons').hide();
    $('#map').css('filter', 'blur(8px)');
    $('#searchInput').css('filter', 'blur(8px)');
}

function closeLegend() {
    $('#legendOverlay').hide();
    $('#toolbarButtons').show();
    $('#map').css('filter', 'none');
    $('#searchInput').css('filter', 'none');
    $('#legendOverlay').css('-webkit-backdrop-filter', 'none');
    //$('#addOverlay').fadeOut('slow');
}

function showAbout() {
    $('#aboutOverlay').show();
    $('#toolbarButtons').hide();
    $('#map').css('filter', 'blur(16px)');
    $('#searchInput').css('filter', 'blur(16px)');
}

function closeAbout() {
    $('#aboutOverlay').hide();
    $('#toolbarButtons').show();
    $('#map').css('filter', 'none');
    $('#searchInput').css('filter', 'none');
    $('#aboutOverlay').css('-webkit-backdrop-filter', 'none');
    //$('#addOverlay').fadeOut('slow');
}

function toggleLayers() {
    $('#toggleOverlay').show();
    $('#toolbarButtons').hide();
    $('#map').css('filter', 'blur(8px)');
    $('#searchInput').css('filter', 'blur(8px)');
    $('#toolbarButtons').css('filter', 'blur(8px)');
}

function closeToggle() {
    $('#toggleOverlay').hide();
    $('#map').css('filter', 'none');
    $('#searchInput').css('filter', 'none');
    $('#toggleOverlay').css('-webkit-backdrop-filter', 'none');
    $('#toolbarButtons').css('filter', 'none');
    $('#toolbarButtons').show();
}

function showTopoLayer(layerName, buttonName) {
    if (map.getLayoutProperty(layerName, 'visibility') == 'visible') {
        map.setLayoutProperty(layerName, 'visibility', 'none');
        $('#' + buttonName).removeClass('inverted');
    } else {
        map.setLayoutProperty(layerName, 'visibility', 'visible');
        $('#' + buttonName).addClass('inverted');
    }
}

function easing(t) {
    return t * (2 - t);
}

function tourShow() {
    // https://github.com/mapbox/mapbox-gl-js/issues/4029
    const mapInteractionHandlers = [
        'scrollZoom', 'dragPan', 'touchZoomRotate', 'dragRotate', 'keyboard', 'boxZoom', 'doubleClickZoom'
    ];

    for (let handler of mapInteractionHandlers) {
        map[handler].disable();
    }

    map.setPitch(60);
    map.setBearing(-12);
    map.setZoom(16);
    map.getCanvas().focus();

    // https://www.mapbox.com/mapbox-gl-js/example/3d-buildings/
    var layers = map.getStyle().layers;

    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
                "interpolate", ["linear"], ["zoom"],
                15, 0,
                15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': .6
        }
    }, labelLayerId);

    map.getCanvas().addEventListener('keydown', function(e) {
        e.preventDefault();
        if (e.which === 38) { // up
            map.panBy([0, -deltaDistance], {
                easing: easing
            });
        } else if (e.which === 40) { // down
            map.panBy([0, deltaDistance], {
                easing: easing
            });
        } else if (e.which === 37) { // left
            map.easeTo({
                bearing: map.getBearing() - deltaDegrees,
                easing: easing
            });
        } else if (e.which === 39) { // right
            map.easeTo({
                bearing: map.getBearing() + deltaDegrees,
                easing: easing
            });
        }
    }, true);

    //$('#walkingSitButton').addClass('green');
    $('#toolbarButtons').hide();
    $('#tourbarButtons').show();
}

function tourRemove() {
    const mapInteractionHandlers = [
        'scrollZoom', 'dragPan', 'touchZoomRotate', 'dragRotate', 'keyboard', 'boxZoom', 'doubleClickZoom'
    ];

    for (let handler of mapInteractionHandlers) {
        map[handler].enable();
    }

    map.setZoom(16);
    map.setBearing(0);
    map.setPitch(0);
    map.getCanvas().removeEventListener('keydown', null);
    map.removeLayer('3d-buildings');
    walking = false;
    $('#walkingSitButton').removeClass('green');
    $('#toolbarButtons').show();
    $('#tourbarButtons').hide();
}

function tourUp() {
    map.panBy([0, -deltaDistance], {
        easing: easing
    });
}

function tourDown() {
    map.panBy([0, deltaDistance], {
        easing: easing
    });
}

function tourLeft() {
    map.easeTo({
        bearing: map.getBearing() - deltaDegrees,
        easing: easing
    });
}

function tourRight() {
    map.easeTo({
        bearing: map.getBearing() + deltaDegrees,
        easing: easing
    });
}