#!/bin/sh

prisma generate --schema=src/prisma/schema.prisma 

npm run start

exec "$@"