#!/usr/bin/env bash

set -e #exit if any command fails
set +x #echo off

ENV=$1
echo "ENV: $ENV"

EXPORT_CMD=""

if [ "$ENV" == "localdev" ]
then
  EXPORT_CMD="export NODE_ENV=localdev"
elif [ "$ENV" == "dev" ]
then
  EXPORT_CMD="export NODE_ENV=development"
elif [ "$ENV" == "test" ]
then
  EXPORT_CMD="export NODE_ENV=test"
elif [ "$ENV" == "prod" ]
then
  EXPORT_CMD="export NODE_ENV=production"
fi

if [ ! -z "$EXPORT_CMD" ]
then
	echo "EXPORT_CMD: $EXPORT_CMD"
	eval ${EXPORT_CMD}
fi


yarn start

#echo "Running Postgraphile"
#yarn start:postgraphile

#echo "Running Featherjs"
#yarn start:featherjs