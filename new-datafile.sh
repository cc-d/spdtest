#!/bin/sh
dd if=/dev/zero of="${1}mb.data" bs=1M count="$1"