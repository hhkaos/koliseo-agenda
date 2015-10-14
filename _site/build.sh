#!/bin/bash
set -e

if [ ! -d .master ]; then
  git clone git@github.com:icoloma/koliseo-agenda.git .master
else
  cd .master
  git pull
  cd ..
fi
cp .master/build/* js/
