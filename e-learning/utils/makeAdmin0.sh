#!/bin/bash

mapshaper -i ./tmp/ne_50m_admin_0_countries.shp \
  -filter-fields NAME,ADM0_A3,LABEL_X,LABEL_Y \
  -snap \
  -simplify visvalingam percentage=0.085 weighting=0.7 stats \
  -clean rewind \
  -o ne_admin0.json format=geojson precision=0.01 gj2008
