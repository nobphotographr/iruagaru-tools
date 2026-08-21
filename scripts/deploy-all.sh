#!/usr/bin/env bash
set -euo pipefail

GITHUB_ROOT="${IRUAGARU_GITHUB_ROOT:-/Users/nobu/Github}"
REMOTE_HOST="${IRUAGARU_SSH_HOST:-xs360830@xs360830.xsrv.jp}"
REMOTE_PORT="${IRUAGARU_SSH_PORT:-10022}"
SSH_KEY="${IRUAGARU_SSH_KEY:-/Users/nobu/.ssh/id_ed25519}"
REMOTE_ROOT="${IRUAGARU_REMOTE_ROOT:-/home/xs360830/iruagaru.com/public_html/tools}"
SSH_COMMAND="ssh -i ${SSH_KEY} -p ${REMOTE_PORT}"

build() {
  local project="$1"
  local script="$2"
  echo "==> Building ${project}"
  (cd "${GITHUB_ROOT}/${project}" && npm run "${script}")
}

deploy_dir() {
  local source="$1"
  local slug="$2"
  echo "==> Publishing ${slug}"
  ssh -i "${SSH_KEY}" -p "${REMOTE_PORT}" "${REMOTE_HOST}" "mkdir -p '${REMOTE_ROOT}/${slug}'"
  rsync -az --delete --exclude '.DS_Store' -e "${SSH_COMMAND}" \
    "${source}/" "${REMOTE_HOST}:${REMOTE_ROOT}/${slug}/"
}

npm --prefix "${GITHUB_ROOT}/iruagaru-tools" test

build image-splitter build
build image-composer build
build image-framer build
build image-annotator build:static
build image-converter build
build raw-to-dng-converter build
build X3F-to-DNG-Converter build
build photo-sequencer build
build photo-compare build
build note-cover-maker build
build ai-text-formatter test
build writing-checker test
build photo-metadata-inspector test
build pdf-edit test
build route-motion check

"${GITHUB_ROOT}/iruagaru-tools/deploy.sh"

deploy_dir "${GITHUB_ROOT}/x-carousel-preview/static" post-preview
deploy_dir "${GITHUB_ROOT}/image-splitter/out" image-splitter
deploy_dir "${GITHUB_ROOT}/image-composer/out" image-composer
deploy_dir "${GITHUB_ROOT}/image-framer/out" image-framer
deploy_dir "${GITHUB_ROOT}/image-annotator/out" image-annotator
deploy_dir "${GITHUB_ROOT}/image-converter/out" image-converter
deploy_dir "${GITHUB_ROOT}/raw-to-dng-converter/out" raw-to-dng
deploy_dir "${GITHUB_ROOT}/X3F-to-DNG-Converter/out" x3f-to-dng
deploy_dir "${GITHUB_ROOT}/photo-sequencer/out" photo-sequence
deploy_dir "${GITHUB_ROOT}/photo-compare/out" photo-compare
deploy_dir "${GITHUB_ROOT}/note-cover-maker/out" note-cover

TEXT_FORMATTER_STAGE="$(mktemp -d)"
trap 'rm -rf "${TEXT_FORMATTER_STAGE}"' EXIT
cp "${GITHUB_ROOT}/ai-text-formatter/index.html" "${TEXT_FORMATTER_STAGE}/"
cp "${GITHUB_ROOT}/ai-text-formatter/style.css" "${TEXT_FORMATTER_STAGE}/"
cp "${GITHUB_ROOT}/ai-text-formatter/script.js" "${TEXT_FORMATTER_STAGE}/"
cp "${GITHUB_ROOT}/ai-text-formatter/formatter-core.js" "${TEXT_FORMATTER_STAGE}/"
cp "${GITHUB_ROOT}/ai-text-formatter/og.png" "${TEXT_FORMATTER_STAGE}/"
cp "${GITHUB_ROOT}/ai-text-formatter/favicon.ico" "${TEXT_FORMATTER_STAGE}/"
cp "${GITHUB_ROOT}/ai-text-formatter/favicon-32.png" "${TEXT_FORMATTER_STAGE}/"
cp "${GITHUB_ROOT}/ai-text-formatter/favicon-192.png" "${TEXT_FORMATTER_STAGE}/"
cp "${GITHUB_ROOT}/ai-text-formatter/apple-touch-icon.png" "${TEXT_FORMATTER_STAGE}/"
deploy_dir "${TEXT_FORMATTER_STAGE}" text-formatter

deploy_dir "${GITHUB_ROOT}/writing-checker/out" writing-checker
deploy_dir "${GITHUB_ROOT}/photo-metadata-inspector/out" photo-metadata
deploy_dir "${GITHUB_ROOT}/pdf-edit/out" pdf-edit
deploy_dir "${GITHUB_ROOT}/route-motion/out" route-motion

echo "Published all static tools to https://tools.iruagaru.com/"
