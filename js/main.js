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

    /*if (window.navigator.standalone == True) {
        $('.mapboxgl-ctrl-top-left').css('padding-top', '30pt');
        $('.mapboxgl-ctrl-top-left').css('padding-top', '30pt');
    }*/

    // Check to see if the app is running for the first time. If so, show the first run overlay.
    /*if (localStorage.getItem('firstRun') != 'false') {
        $('#firstOverlay').show();
        localStorage.setItem('firstRun', 'false');
    }*/

    // Clear the search box (in case the value was saved across sessions).
    $('#textSearch').val('');

    /*toastr.options = {
        'positionClass': 'toast-bottom-left'
    };*/

    // Tell users that the points are loading.
    //toastr.info('Please wait...', 'Getting stories');
    $('#pointLoadingInfo').show();

    // Load up Mapbox GL - access token and the main map element.
    // The default style is a plain white one. 
    // Note: If you're rolling your own HereStory instance, you'll need to change the token and style.
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

    // Add zoom and orientation controls to top right corner of the map.
    //map.addControl(new mapboxgl.NavigationControl());

    // Here, we're executing a few things once the map is loaded.
    map.on('load', function () {

        getData();

        /*map.on('click', 'euExplLayer', function (e) {
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(e.features[0].properties.name)
                .addTo(map);
        });*/

		/* See if the user wants to load the map with certain points loaded, either a hashtag or story.
			Format:
				By hashtag: ?searchtype=tag&value=<hashtag>
				By story: ?searchtype=story&value=<story>
			Reference for substring:
				http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
		*/
        
        map.resize();
    });

    // This adds a popup if the current location point clicked.
	/*map.on('click', 'curLoc', function (e) {
        new mapboxgl.Popup()
            .setLngLat(e.features[0].geometry.coordinates)
            .setHTML(e.features[0].properties.description)
            .addTo(map);
    });*/
    map.on('click', function (e) {
        var layerList = ['euExplLayer', 'atsiLayer', 'polLayer', 'busLayer', 'monarLayer', 'relLayer', 'warLayer'];
        var clickedLayer = map.queryRenderedFeatures(e.point)[0].layer.id;
        if (layerList.indexOf(clickedLayer) > -1) {
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML('<p></p><b>' + map.queryRenderedFeatures(e.point)[0].properties.name + '</b><p>' + map.queryRenderedFeatures(e.point)[0].properties.description + '</p><p><b>References</b><br \\>' + map.queryRenderedFeatures(e.point)[0].properties.refs)
                .addTo(map);
        }
        /*if (clickedLayer == 'euExplLayer' || clickedLayer == 'atsiLayer' || clickedLayer == 'polLayer' || clickedLayer == 'busLayer' || clickedLayer == 'monarLayer' || clickedLayer == 'relLayer' || clickedLayer == 'warLayer') {
            new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML('<p></p><b>' + map.queryRenderedFeatures(e.point)[0].properties.name + '</b><p>' + map.queryRenderedFeatures(e.point)[0].properties.description + '</p><p><b>References</b><br \\>' + map.queryRenderedFeatures(e.point)[0].properties.refs)
                .addTo(map);
        }*/
    });
    // This is hear in case we want to implement "click place to add story" functionality.
    // Source: https://www.mapbox.com/mapbox-gl-js/example/mouse-position/
    /*map.on('click', function (e) {
        try {
            var clickedLayer = map.queryRenderedFeatures(e.point)[0].layer.id;
            if (clickedLayer == 'pointsLoc') {
                var img = map.queryRenderedFeatures(e.point)[0].properties.img;
                if (img === "") {
                    $('#iconExpand').hide();
                } else {
                    $('#iconExpand').show();
                    $('#iconExpand').attr('href', 'images/' + img);
                }
                $('#descLabel').html(map.queryRenderedFeatures(e.point)[0].properties.description);
                $('#dateLabel').html(map.queryRenderedFeatures(e.point)[0].properties.date);
                $('#refLabel').html(map.queryRenderedFeatures(e.point)[0].properties.ref);
                $('#tagLabel').html('#' + map.queryRenderedFeatures(e.point)[0].properties.tag);
                toggleMenu();
            } else if (clickedLayer == 'euExplLayer' || clickedLayer == 'atsiLayer' || clickedLayer == 'polLayer' || clickedLayer == 'busLayer' || clickedLayer == 'monarLayer' || clickedLayer == 'relLayer' || clickedLayer == 'warLayer') {
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML('<p></p><b>' + map.queryRenderedFeatures(e.point)[0].properties.name + '</b><p>' + map.queryRenderedFeatures(e.point)[0].properties.description + '</p><p><b>References</b><br \\>' + map.queryRenderedFeatures(e.point)[0].properties.refs)
                    .addTo(map);
            } else {
                $('#textLocation').val(String(map.queryRenderedFeatures(e.point)[0].lngLat.lat) + ', ' + String(map.queryRenderedFeatures(e.point)[0].lngLat.lng));
                showAdd();
                $('#addOverlay').show();
            }
        } catch (err) {
            console.log(e);
            $('#textLocation').val(String(e.lngLat.lat) + ', ' + String(e.lngLat.lng));
            showAdd();
        }
    });*/

    // Click handler for the points available on the map.
    /*map.on('click', 'pointsLoc', function (e) {
        // This holds the img name for the points as the sidebar needs to be changed if there is an image.
		// While this is true of all points, the image element needs to be hidden if there is no image.
        var img = e.features[0].properties.img;
        if (img === "") {
			// The following line is there in case it would be better to have a "no image" placeholder instead of hiding the image element in its entirety.
            //$('#imgStory').attr('src', 'img/nopic.png');
			// The following two lines hide the image element itself and the corner link that "expands" the image.
            $('#imgStory').hide();
            $('#iconExpand').hide();
        } else {
            $('#imgStory').show();
            $('#iconExpand').show();
			// Change the image element and the expand link to the value of the story (img variable).
            $('#imgStory').attr('src', 'images/' + img);
            $('#iconExpand').attr('href', 'images/' + img);
        }
		// Set the description and tag labels (element) to the appropriate values from the clicked point.
        $('#descLabel').html(e.features[0].properties.description + '<p></p><br \\>Date: ' + e.features[0].properties.date);
        $('#tagLabel').html('<i class="hashtag icon"></i>' + e.features[0].properties.tag);
		// Show the menu.
        toggleMenu();
    });*/

    // This checks to see if enter is pressed (KeyboardEvent value 13) and if so, get the value of the text input and pass that to the "getPoints()" method.
    /*$("#textSearch").on("keydown", function (e) {
        // Get the keycode value and check to see if it's 13 (KeyboardEvent value for enter).
        if (e.keyCode === 13) {
            // "Blur" is equivalent to losing focus which moves the cursor out of the text input.
            $("#textSearch").blur();
            var textValue = $("#textSearch").val();
            // Get all the points and pass the value of the text input.
            // The second value is whether or not to zoom in on the points. This is helpful for searches
            // to fit all of them into the viewport.
            getPoints(textValue, true);
        }
    });*/
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

    //$('#pointsLoadingText').html('Getting layer 1 of 7...')

    map.addSource('euExplSource', {
        type: 'geojson',
        data: dataDir + 'euexpl.json'
    });

    //#2185d0
    map.addLayer({
        "id": "euExplLayer",
        "type": "line",
        "source": "euExplSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth
          }
    });

    //$('#pointsLoadingText').html('Getting layer 2 of 7...')

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
            "line-width": lineWidth
          }
    });

    //$('#pointsLoadingText').html('Getting layer 2 of 7...')

    map.addSource('polSource', {
        type: 'geojson',
        data: dataDir + 'pol.json'
    });

    // #00b5ad
    map.addLayer({
        "id": "polLayer",
        "type": "line",
        "source": "polSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth
          }
    });

    //$('#pointsLoadingText').html('Getting layer 3 of 7...')

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
            "line-width": lineWidth
          }
    });

    //$('#pointsLoadingText').html('Getting layer 4 of 7...')

    map.addSource('busSource', {
        type: 'geojson',
        data: dataDir + 'business.json'
    });

    // #db2828
    map.addLayer({
        "id": "busLayer",
        "type": "line",
        "source": "busSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth
          }
    });

    //$('#pointsLoadingText').html('Getting layer 5 of 7...')

    map.addSource('monarSource', {
        type: 'geojson',
        data: dataDir + 'monarchy.json'
    });

    // #6033c1
    map.addLayer({
        "id": "monarLayer",
        "type": "line",
        "source": "monarSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth
          }
    });

    //$('#pointsLoadingText').html('Getting layer 6 of 7...')

    map.addSource('relSource', {
        type: 'geojson',
        data: dataDir + 'religious.json'
    });

    // #fbbd08
    map.addLayer({
        "id": "relLayer",
        "type": "line",
        "source": "relSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth
          }
    });

    //$('#pointsLoadingText').html('Getting layer 7 of 7...')

    map.addSource('warSource', {
        type: 'geojson',
        data: dataDir + 'war.json'
    });

    // #a5673f
    map.addLayer({
        "id": "warLayer",
        "type": "line",
        "source": "warSource",
        "paint": {
            "line-color": lineColour,
            "line-width": lineWidth
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

        // Add the current location source.
        /*map.addSource('curSource', {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                'features': [{
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [lng, lat]
                    },
                    'properties': {
                        'description': '<br \\>Your Current Location',
                        'icon': 'circle-stroked'
                    }
                }]
            }
        });

        map.addLayer({
            'id': 'curLoc',
            'type': 'symbol',
            'source': 'curSource',
            'layout': {
                'icon-image': '{icon}-15'
            }
        });*/

        // Set firstRun to false since we don't need to keep adding the source and layer (we just change it).
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

    /* -------------------------
    TO-DO HERE - ADD DIALOG THAT ASKS PEOPLE TO WAIT WHILE POINTS ARE LOADED.
    HERE, THE DIALOG WOULD BE HIDDEN.
    ------------------------- */

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
    //map.setZoom(16);
    // Change the icon on the location toolbar button back to the location arrow from the spinning/loading icon.
    //$('#centerLocButtonIcon').removeClass('asterisk loading');
    //$('#centerLocButtonIcon').addClass('location arrow');

    /*if (addDialog === true) {
        $('#addOverlay').show();
        addDialog = false;
    }*/

    // Clear any toasts that are visible.
    //toastr.clear();
    $('#pointLoadingInfo').hide();
}

// This function is responsible for submitting the story - passing the data to the addStory script.
function submitStory() {
    // Show the upload progress dialog.
    showUploadProgress();
    // Get the story data.
    var storyData = new FormData($("#formStory")[0]);
    // Send a POST request with the data from the add story overlay.
    $.ajax({
        type: "POST",
        url: "db_scripts/addStory.php",
        data: storyData,
        complete: function (data) {
            // Close the add overlay.
            closeAdd();
            // Close the upload overlay.
            closeUploadProgress();
            // Reset the form.
            document.getElementById('formStory').reset();
            // Get all the points.
            getPoints('');
        },
        success: function (data) {
            // Close the add overlay.
            closeAdd();
            // Close the upload overlay.
            closeUploadProgress();
            // Reset the form.
            document.getElementById('formStory').reset();
            // Get all the points.
            //getPoints('');
        },
        error: function (xhr) {
            console.log(xhr.status);
        },
        cache: false,
        contentType: false,
        processData: false
    });
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

    /*if (walking == false) {
        for (let handler of mapInteractionHandlers) {
            map[handler].disable();
        }

        map.setPitch(60);
        map.setBearing(-12);
        map.setZoom(16);
        map.getCanvas().focus();

        // https://www.mapbox.com/mapbox-gl-js/example/game-controls/
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
        walking = true;

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

        $('#walkingSitButton').addClass('green');

    } else {
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
    }*/
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