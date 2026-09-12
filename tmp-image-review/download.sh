#!/usr/bin/env bash
set -u
mkdir -p image-review-output
printf 'index,product,status,filename,source_url\n' > image-review-output/manifest.csv
jq -c '.[]' tmp-image-review/manifest.json | while read -r row; do
  i=$(printf '%s' "$row" | jq -r '.i')
  name=$(printf '%s' "$row" | jq -r '.name')
  num=$(printf '%03d' "$i")
  slug=$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]\+/-/g;s/^-//;s/-$//')
  local_path=$(printf '%s' "$row" | jq -r '.local // empty')
  url=$(printf '%s' "$row" | jq -r '.url // empty')
  status='missing'
  filename=''
  if [ -n "$local_path" ] && [ -f "$local_path" ]; then
    ext="${local_path##*.}"
    filename="${num}-${slug}.${ext}"
    cp "$local_path" "image-review-output/$filename"
    status='local-reviewed-source'
  elif [ -n "$url" ]; then
    tmp="image-review-output/${num}-${slug}.tmp"
    if curl -L --fail --silent --show-error --retry 2 --retry-all-errors --connect-timeout 15 --max-time 60 \
      -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154 Safari/537.36' \
      -H 'Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8' \
      "$url" -o "$tmp"; then
      mime=$(file -b --mime-type "$tmp" || true)
      case "$mime" in
        image/jpeg) ext='jpg' ;;
        image/png) ext='png' ;;
        image/webp) ext='webp' ;;
        image/gif) ext='gif' ;;
        image/avif) ext='avif' ;;
        *) ext='' ;;
      esac
      if [ -n "$ext" ] && [ -s "$tmp" ]; then
        filename="${num}-${slug}.${ext}"
        mv "$tmp" "image-review-output/$filename"
        status='downloaded'
      else
        rm -f "$tmp"
        status="invalid-${mime:-unknown}"
      fi
    else
      rm -f "$tmp"
      status='download-failed'
    fi
  fi
  safe_name=$(printf '%s' "$name" | sed 's/"/""/g')
  safe_url=$(printf '%s' "$url" | sed 's/"/""/g')
  printf '%s,"%s",%s,"%s","%s"\n' "$i" "$safe_name" "$status" "$filename" "$safe_url" >> image-review-output/manifest.csv
  echo "[$num] $name -> $status $filename"
done
zip -qr IKINOVAC_REAL_PRODUCT_IMAGES_RAW.zip image-review-output
