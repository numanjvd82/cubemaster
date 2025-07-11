#!/bin/bash

# Deployment troubleshooting script for Prisma engine issues

echo "🔍 Checking Prisma engine files..."
ls -la src/generated/prisma/libquery_engine-*.so.node

echo "📋 Checking environment variables..."
echo "PRISMA_CLI_BINARY_TARGETS: $PRISMA_CLI_BINARY_TARGETS"
echo "NODE_ENV: $NODE_ENV"

echo "🔧 Regenerating Prisma client..."
npx prisma generate

echo "✅ Prisma client regenerated successfully"

echo "🚀 Building the project..."
npm run build

echo "✅ Build completed"
