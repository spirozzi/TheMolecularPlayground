#!/bin/bash
echo "The Molecular Playground - Development Mode"
echo "- NODE_ENV environment variable set to: development"
echo "- All incoming HTTP requests will be logged to ./httpreqs.log"
echo "- Output will be printed to stdout and logged to ./dev-server-out.log"
echo "Running 'startdevserver' script in src/package.json ..."
echo ""
cd src/
npm run-script rundevserver 2>&1 | tee ../dev-server-out.log
