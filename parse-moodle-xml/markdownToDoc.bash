#!/bin/bash
mkdir -p markdown
mkdir -p docx

node "."

wait

for path in ./markdown/*; do
  echo "Converting ${path} to docx...";
  filename="${path/.\/markdown\//}"
  pandoc ${path} -f markdown -t docx -s -o ./docx/${filename/.md/.docx}
done

