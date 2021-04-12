#!/bin/bash

socat TCP-LISTEN:1338,reuseaddr,fork EXEC:"python3 getfile.py"
