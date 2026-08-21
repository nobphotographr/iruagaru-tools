#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="xs360830@xs360830.xsrv.jp"
REMOTE_PORT="10022"
REMOTE_ROOT="/home/xs360830/iruagaru.com/public_html/tools.iruagaru.com"
SSH_KEY="/Users/nobu/.ssh/id_ed25519"

npm test

rsync -az --delete \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude 'tests/' \
  --exclude 'package.json' \
  --exclude 'README.md' \
  --exclude 'deploy.sh' \
  -e "ssh -i ${SSH_KEY} -p ${REMOTE_PORT}" \
  ./ "${REMOTE_HOST}:${REMOTE_ROOT}/"
