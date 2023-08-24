#!/bin/bash

# This script downloads the 1:50m Admin0-Countries dataset from Natural Earth
# (https://www.naturalearthdata.com/downloads/50m-cultural-vectors/),
# then uses mapshaper to simplify and convert the data for rendering.

base_dir=${GITHUB_WORKSPACE:="../"}
# mkdir -p tmp
# curl -L -k -o ./tmp/ne_50m_admin_0_countries.zip https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/50m/cultural/ne_50m_admin_0_countries.zip
# unzip -o ./tmp/ne_50m_admin_0_countries -d ./tmp
./../node_modules/.bin/mapshaper -i ./tmp/ne_50m_admin_0_countries.shp \
    -filter-fields ADMIN,ISO_A3_EH,LABEL_X,LABEL_Y \
    -snap \
    -simplify visvalingam percentage=0.085 weighting=0.7 stats \
    -clean rewind \
    -o ./src/data/ne_countries.json format=geojson precision=0.01 gj2008
./../node_modules/.bin/mapshaper -i ./tmp/ne_50m_admin_0_countries.shp \
    -filter-fields ADMIN,ISO_A3_EH,LABEL_X,LABEL_Y \
    -snap \
    -simplify visvalingam percentage=0.085 weighting=0.7 stats \
    -clean rewind \
    -dissolve \
    -o ./src/data/ne_coastline.json format=geojson precision=0.01 gj2008 geojson-type="FeatureCollection"
