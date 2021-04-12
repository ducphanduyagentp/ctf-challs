#!/bin/bash

socat TCP-LISTEN:1339,reuseaddr,fork EXEC:"./babygraph"