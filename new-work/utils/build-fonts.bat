fonttools subset ./fonts/NewEdge666-UltraLightRounded.otf --unicodes-file="latin-ext.txt" --layout-features="kern,liga,clig,calt,ccmp,locl,mark,mkmk,onum,pnum,smcp,c2sc,frac,lnum,tnum,subs,sups" --desubroutinize
ttx ./fonts/NewEdge666-UltraLightRounded.subset.otf
ttx --flavor=woff ./fonts/NewEdge666-UltraLightRounded.subset.ttx
ttx --flavor=woff2 ./fonts/NewEdge666-UltraLightRounded.subset.ttx
