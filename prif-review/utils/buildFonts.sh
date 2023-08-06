fonttools subset ./static/fonts/roboto-flex.ttf --unicodes-file="latin-ext.txt" --layout-features="kern,liga,clig,calt,ccmp,locl,mark,mkmk,onum,pnum,smcp,c2sc,frac,lnum,tnum,subs,sups" --desubroutinize
ttx ./static/fonts/roboto-flex.subset.ttf
ttx --flavor=woff ./static/fonts/roboto-flex.subset.ttx
ttx --flavor=woff2 ./static/fonts/roboto-flex.subset.ttx
