#!/bin/bash
echo "The Molecular Playground - Production Mode"
echo "- NODE_ENV environment variable set to: production"
echo "- Incoming HTTP requests will not be logged"
echo "- Output will be printed to stdout and logged to ./prod-server-out.log"
echo "Running 'startproductionserver' script in src/package.json ..."
echo ""
cd src/
npm run-script runproductionserver 2>&1 | tee ../prod-server-out.log
