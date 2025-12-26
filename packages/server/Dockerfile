# Base image for common dependencies
FROM node:24-alpine as common-deps

WORKDIR /app

# Copy only the necessary files for dependency resolution
COPY ./package.json ./yarn.lock ./.yarnrc.yml ./tsconfig.base.json ./nx.json /app/
COPY ./.yarn/releases /app/.yarn/releases
#COPY ./.yarn/patches /app/.yarn/patches

COPY ./.prettierrc /app/
COPY ./packages/server/package.json /app/packages/server/
COPY ./packages/server/patches /app/packages/server/patches
COPY ./packages/frontend/package.json /app/packages/frontend/

# Install all dependencies
RUN yarn && yarn cache clean && npx nx reset


# Build the back
FROM common-deps as server-build

# Copy sourcecode after installing dependences to accelerate subsequents builds
COPY ./packages/server /app/packages/server

RUN NX_DAEMON=false npx nx run server:build
RUN mv /app/packages/server/dist /app/packages/server/build
RUN NX_DAEMON=false npx nx run server:build:packageJson
RUN mv /app/packages/server/package.json /app/packages/server/package.json
RUN rm -rf /app/packages/server/dist
RUN mv /app/packages/server/build /app/packages/server/dist

#RUN yarn workspaces focus --production server


# Build the front
FROM common-deps as frontend-build

ARG VITE_BACKEND_URL


COPY ./packages/frontend /app/packages/frontend
RUN NX_DAEMON=false npx nx build frontend


# Final stage: Run the application
FROM node:22-alpine as yaari

# Used to run healthcheck in docker
RUN apk add --no-cache curl jq

RUN npm install -g tsx

RUN apk add --no-cache postgresql-client

COPY packages/server/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
WORKDIR /app/packages/server

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL $VITE_BACKEND_URL

ARG APP_VERSION
ENV APP_VERSION $APP_VERSION


# Copy built applications from previous stages
COPY --chown=1000 --from=server-build /app /app
COPY --chown=1000 --from=server-build /app/packages/server /app/packages/server
COPY --chown=1000 --from=frontend-build /app/packages/frontend/build /app/packages/server/dist/frontend

# Set metadata and labels
LABEL org.opencontainers.image.source=https://github.com/YaariAPI/YaariAPI
LABEL org.opencontainers.image.description="This image provides a consistent and reproducible environment for the backend and frontend, ensuring it deploys faster and runs the same way regardless of the deployment environment."

RUN mkdir -p /app/.local-storage /app/packages/server/.local-storage && \
    chown -R 1000:1000 /app

# Use non root user with uid 1000
USER 1000

CMD ["node", "dist/src/main"]
ENTRYPOINT ["/app/entrypoint.sh"]
