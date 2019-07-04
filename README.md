# Topomapper

## Description

As part of a larger research project, this mobile friendly web application documents the commemorative work done through the street naming in Townsville, QLD (Australia). Sparked by work in critical toponymy that highlights the selective comemorative work done through the mundane naming practices of civic space ([Azaryahu, 1996](https://journals.sagepub.com/doi/pdf/10.1068/d140311); [Berg & Vuolteenaho, 2009](https://books.google.com.au/books/about/Critical_Toponymies.html?id=xg1GAepFft8C&redir_esc=y); [Rose-Redwood, 2016](https://www.acme-journal.org/index.php/acme/article/view/1215); [Smith, 2018](https://www.tandfonline.com/doi/abs/10.1080/00377996.2018.1460569)), this web application seeks to surface the people, events and moments remembered across the city's geography.

![Topomapper Screenshot](img/topomapper_sshot_both.png)

## Project

### Progress

The following suburbs have been mapped:
- Townsville City
- North Ward
- South Townsville
- Belgian Gardens

Next up:
- West End (this has been partially mapped, albeit roughly - this is very much a work in progress)
- (potentially) Garbutt

NOTE: Efforts to map will slow down as each of the four suburbs above will be cleaned up, proofed and filled out with further context.

### Viewing

Interested in viewing the application? Visit [here](https://bryanabsmith.com/topomapper/).

### Browser support

The application is developed and tested in Firefox (68) but has been tested on and is thought to work with the following (with little to no errors).

#### Desktop
- Firefox (68)
- Chrome (74)
- Safari (12.1.1)
- Edge (44) - NOTE: getting street information is frustrating (the clickable space for the street layer seems to be minimal relative to other browsers)

#### Mobile
- Safari (iOS, 12.3.1)
- Chrome (Android, 74)

It is possible (and likely for those that aren't much older than these) that it will work with older browsers and those not listed here.

## Development

### Install/deploy on your own server

1. Clone the code

    ``` git clone https://github.com/bryan-ab-smith/topomapper.git```

2. Get a MapBox token. See [here](https://account.mapbox.com/access-tokens/) for more information (you will need to sign up for a MapBox account if you don't already have one). Add this to js/mapbox.js.template as the value for the mbToken variable.

3. There are two map styles - one satellite and one "light." In mapbox.js.template, there is a variable for each (mbStyleLight and mbStyleSat). Ultimately, the style doesn't matter but note that the light variant is the default. You can get and generate styles [here](https://www.mapbox.com/mapbox-studio/) using MapBox Studio. Once you've generated/created a style, copy the style url (eg. mapbox://...) to the appropriate variables in mapbox.js.template.

4. Rename js/mapbox.js.template to js/mapbox.js.

5. Upload everything to your web server and everything should work.

### Local development

The debug_server.py script is a simple non-logging web server that you can use to quickly setup an environment to debug and play with Topomapper. While it will work to serve Topomapper, you are strongly discouraged from using this as a production (ie. public) facing server.

The server is written in Python and works with Python 2 and 3 (and should therefore work on any platform that Python supports including Windows, macOS, Linux and others). To run it, simply execute the script (it will detect the Python version automatically and run as needed).

## License

MIT License

Copyright (c) 2019 Bryan Smith.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

### Note about the street GeoJSON data
The GeoJSON co-ordinate data (datafiles/) comes from OpenStreetMap. That data is available under the Open Database License (see [here](https://opendatacommons.org/licenses/odbl/1-0/)).
