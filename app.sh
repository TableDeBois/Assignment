#!/usr/bin/env bash

rm output.txt
python -u main.py ${1-4} >> output.txt
