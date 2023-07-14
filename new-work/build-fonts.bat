fonttools subset ./static/NewEdge666-UltraLightRounded.otf --unicodes-file="latin-ext.txt" --layout-features="kern,liga,clig,calt,ccmp,locl,mark,mkmk,onum,pnum,smcp,c2sc,frac,lnum,tnum,subs,sups" --desubroutinize
ttx ./static/NewEdge666-UltraLightRounded.subset.otf
ttx --flavor=woff ./static/NewEdge666-UltraLightRounded.subset.ttx
ttx --flavor=woff2 ./static/NewEdge666-UltraLightRounded.subset.ttx
