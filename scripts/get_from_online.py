#!/usr/bin/env python3
import requests

streets = []
URL_PREFIX = 'https://bryanabsmith.com/topomapper/datafiles/'

#files = ['atsi', 'business', 'etc', 'euexpl', 'local', 'monarchy', 'none', 'pol', 'religious', 'toadd', 'transplants', 'war']
files = ['atsi', 'business', 'etc', 'euexpl', 'local', 'monarchy',
         'none', 'pol', 'religious', 'transplants', 'war']

for theme in files:
    print('Getting {}...'.format(theme))
    # https://stackoverflow.com/a/16575064
    temp_json = requests.get(URL_PREFIX + theme + '.json').json()
    for x in temp_json['features']:
        streets.append('{} $ {} $ {}'.format(
            x['properties']['name'], x['properties']['description'], theme))

    # https://www.w3schools.com/python/python_howto_remove_duplicates.asp
    streets = list(dict.fromkeys(streets))  # Remove duplicates

print('Creating spreadsheet...')
with open('streetInfo.csv', 'w') as q:
    for x in sorted(streets):
        q.writelines(x + '\n')
    print('Done!')

print('\nIn Excel, create a new spreadsheet, import the csv file created here and set $ as the delimiter.')
