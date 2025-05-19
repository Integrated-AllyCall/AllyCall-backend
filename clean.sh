#!/bin/bash
echo "🧹 Cleaning Python cache files..."
find . -type d -name "__pycache__" -exec rm -r {} +
find . -type f -name "*.py[co]" -delete
echo "Done Cleaning."