#!/bin/bash

# Exit on first error
set -e 

# Clone onut
git submodule update --init

# Create build dir
mkdir -p build

# cd to build dir
cd build

# We want to use hunter and we want to build the stand alone (onut.exe)
cmake -DONUT_USE_HUNTER=OFF -DONUT_BUILD_STANDALONE=ON -DCMAKE_BUILD_TYPE=Release ../onut/

# Compile
make -j8

# Copy executable
cp ./JSStandAlone/onut ../game/ExecutableOSX
