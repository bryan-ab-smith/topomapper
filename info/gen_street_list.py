# https://stackabuse.com/reading-and-writing-json-to-a-file-in-python/

import json

with open('../datafiles/atsi.json') as f:
    data = json.load(f)
    count = 0
    for _ in data['features']:
        print(data['features'][count]['properties']['name'])
        count += 1

    # print(data['features'][0]['properties']['name'])
