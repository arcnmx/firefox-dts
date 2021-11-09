#!/usr/bin/env bash
set -eu

IDL_ROOT=$1

for dir in $(cd $IDL_ROOT && find . -type d); do
	if [[ -n "$(shopt -s nullglob; cd $IDL_ROOT; echo $dir/*.idl)" ]]; then
		IDL_DIRS+=("${dir#./}")
	fi
done

echo "${IDL_DIRS[@]}"
