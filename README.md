## Topomapper

### Description

As part of a larger research project, this mobile friendly web application documents the namesakes of streets in Townsville, QLD (Australia). Built on the premise that street names normalises particular colonial commemorative practices, this application is meant to surface the narrative woven through the naming practices of a small regional Queensland city as a demonstration of the powerful colonial commemoration written into the cartography of settler communities.

### Install/deploy on your own server

1. Clone the code

    ``` git clone https://github.com/bryan-ab-smith/topomapper.git```

2. Get a MapBox token. See [here](https://docs.mapbox.com/help/how-mapbox-works/access-tokens/) for more information. Add this to js/mapbox.js.template as the value for the mbToken variable.

3. There are two map styles - one satellite and one "light." In mapbox.js.template, there is a variable for each (mbStyleLight and mbStyleSat). Ultimately, the style doesn't matter but note that the light variant is the default. You can get and generate styles [here](https://www.mapbox.com/mapbox-studio/) using MapBox Studio.

4. Rename js/mapbox.js.template mapbox.js

5. Upload everything to your web server and everything should work.