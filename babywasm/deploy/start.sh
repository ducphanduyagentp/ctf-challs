#!/bin/bash

socat TCP-LISTEN:1337,reuseaddr,fork EXEC:"python3 getfile.py"