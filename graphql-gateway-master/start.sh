#!/bin/bash -x

# Current memory allocation:
# New From Space (heap) : New To Space (heap) : Old Space (heap) : Non-Heap
# 1 : 1 : V8_SEMI_SPACE_FACTOR : 1
NUM_FRAGMENTS=$(( 3 + V8_SEMI_SPACE_FACTOR))

# Min. New From Space is 64MB due to frequent mem allocations per request
MIN_FRAGMENT_SIZE=64

FRAGMENT_SIZE=$(
bc << EOF
  a=$CURRENT_MEMORY_REQUEST
  b=$NUM_FRAGMENTS
  c=$MIN_FRAGMENT_SIZE

  if (a%(b*1024*1024)) d=a/1024/1024/b+1 else d=a/1024/1024/b
  if (d>c) d else c
EOF
)

exec node --min-semi-space-size=$MIN_FRAGMENT_SIZE \
    --max-semi-space-size=$FRAGMENT_SIZE \
    --max-old-space-size=$(( V8_SEMI_SPACE_FACTOR*FRAGMENT_SIZE )) \
    --no-use-idle-notification \
    --gc-interval=$V8_GC_INTERVAL \
    dist/index.js
