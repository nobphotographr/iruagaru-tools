#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="xs360830@xs360830.xsrv.jp"
REMOTE_PORT="10022"
REMOTE_ROOT="/home/xs360830/iruagaru.com/public_html/tools"
SSH_KEY="/Users/nobu/.ssh/id_ed25519"

npm test

ssh -i "${SSH_KEY}" -p "${REMOTE_PORT}" "${REMOTE_HOST}" \
  "mkdir -p '${REMOTE_ROOT}/assets'"

rsync -az \
  -e "ssh -i ${SSH_KEY} -p ${REMOTE_PORT}" \
  index.html .htaccess "${REMOTE_HOST}:${REMOTE_ROOT}/"

rsync -az --delete \
  -e "ssh -i ${SSH_KEY} -p ${REMOTE_PORT}" \
  assets/ "${REMOTE_HOST}:${REMOTE_ROOT}/assets/"
