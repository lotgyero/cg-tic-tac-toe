ARG NODE_VERSION=8

FROM "node:${NODE_VERSION}" as work_prepare

ARG CHANNEL=undefined
ARG PROJECT=cg-tic-tac-tor
ARG APP_PORT=8080
ARG APP_GROUP_ID=1500
ARG APP_USER_ID=1500
ARG APP_HOST="0.0.0.0"

LABEL \
    project="${PROJECT}" \
    channel="${CHANNEL}" \
    stage="worker"

ENV DEBIAN_FRONTEND="noninteractive" \
    APP_PATH="/opt/${PROJECT}" \
    APP_PROJECT_ID="${PROJECT}" \
    APP_USER_NAME="appserver-user" \
    APP_GROUP_NAME="appserver-group" \
    APP_GROUP_ID="${APP_GROUP_ID}" \
    APP_USER_ID="${APP_USER_ID}" \
    APP_PORT="${APP_PORT}" \
    APP_HOST="${APP_HOST}" \
    NODE_ENV="production" \
    PROJECT="${PROJECT}" \
    CHANNEL="${CHANNEL}"

RUN mkdir -p "${APP_PATH}/node_modules/.bin" \
    && groupadd -g "${APP_GROUP_ID}" "${APP_GROUP_NAME}" \
    && useradd -u "${APP_USER_ID}" -d "${APP_PATH}" -g "${APP_GROUP_NAME}" "${APP_USER_NAME}" \
    && chown -R "${APP_USER_NAME}":"${APP_GROUP_NAME}" "${APP_PATH}"

USER "${APP_USER_NAME}"

WORKDIR "${APP_PATH}"

COPY --chown="${APP_USER_NAME}:${APP_GROUP_NAME}" \
[    \
    "package.json", \
    "yarn.lock", \
    "${APP_PATH}/" \
]

FROM work_prepare as builder_prepare

LABEL stage="builder_prepare"

RUN yarn install \
    --non-interactive \
    --production=false \
    --frozen-lockfile \
    --network-timeout 1000000 \
    && yarn cache clean

ENV PATH="${PATH}:${APP_PATH}/node_modules/.bin"

FROM builder_prepare as worker

LABEL stage="worker"

COPY --chown="${APP_USER_NAME}:${APP_GROUP_NAME}" "./src" "${APP_PATH}/src"


# RUN yarn install \
#     --non-interactive \
#     --production=true \
#     --frozen-lockfile \
#     --network-timeout 1000000 \
#     && yarn cache clean

# ENV PATH="${PATH}:${APP_PATH}/node_modules/.bin"

CMD ["yarn","run","start"]

EXPOSE ${APP_PORT}
