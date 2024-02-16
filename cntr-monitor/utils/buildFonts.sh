#!/bin/bash

base_file="./fonts/Montserrat-Italic-Variable"

rm ${base_file}.subset.ttf
rm ${base_file}.subset.ttx
rm ${base_file}.subset.woff
rm ${base_file}.subset.woff2

fonttools subset ${base_file}.ttf --unicodes-file="latin-ext.txt" --layout-features="kern,liga,clig,calt,ccmp,locl,mark,mkmk,onum,pnum,smcp,c2sc,frac,lnum,tnum,subs,sups"
ttx ${base_file}.subset.ttf
ttx --flavor woff ${base_file}.subset.ttx
ttx --flavor woff2 ${base_file}.subset.ttx

rm ${base_file}.subset.ttf
rm ${base_file}.subset.ttx
