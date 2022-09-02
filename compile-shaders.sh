#!/bin/bash

mkdir -p ./bin/shaders
glslc ./src/shaders/shader.vert -o ./bin/shaders/vert.spv
glslc ./src/shaders/shader.frag -o ./bin/shaders/frag.spv