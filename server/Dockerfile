# -----------------------------------
# STEP 1: BASE
# -----------------------------------
FROM node:20-alpine3.18 AS base

# Install ffmpeg, which includes ffprobe (system binary).
# Also install build tools (g++, make, etc.)
RUN apk add --update \
    python3 py3-pip \
    ffmpeg ttf-dejavu \
    && apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++

# PNPM
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm i -g pnpm && \
    mkdir -p ${PNPM_HOME} && \
    pnpm config set global-bin-dir ${PNPM_HOME}

# -----------------------------------
# STEP 2: DEPENDENCIES & DEPLOYMENT
# -----------------------------------
FROM base AS deploy

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY . .

# Create necessary directories for file processing
RUN mkdir -p /app/temp/input /app/temp/output

ENV NODE_ENV=production
ENV DOCKER=true
EXPOSE 4000

# Launch the Hono application using tsx directly
CMD [ "pnpm", "start" ] 