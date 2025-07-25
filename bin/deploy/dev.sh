#!/usr/bin/env bash
##
#   Rebuild JS project with the latest versions of custom modules being linked from './node_modules/' folder.
##
# root directory (relative to the current shell script, not to the execution point)
DIR_ROOT=${DIR_ROOT:-$(cd "$(dirname "$0")/../../" && pwd)}
DIR_NODE="${DIR_ROOT}/node_modules"
DIR_OWN="${DIR_ROOT}/own_modules"

##
# Internal function to clone & link one GitHub repo
##
processRepo() {
  NAME="@${1}"
  REPO="https://github.com/${1}.git"
  if test ! -d "${DIR_OWN}/${NAME}"; then
    echo "Clone repo '${NAME}' to '${DIR_OWN}'."
    git clone "${REPO}" "${DIR_OWN}/${NAME}" || { echo "Failed to clone ${REPO}"; exit 1; }

  fi
  echo "Link sources from '${NAME}' to '${DIR_NODE}'."
  rm -fr "${DIR_NODE:?}/${NAME}" && ln -s "${DIR_OWN}/${NAME}" "${DIR_NODE}/${NAME}"
}

##
# MAIN FUNCTIONALITY
##
echo "Remove installed dependencies and lock file."
rm -fr "${DIR_NODE}" "${DIR_ROOT}/package-lock.json"

echo "Re-install JS project."
cd "${DIR_ROOT}" || exit 255
npm install --omit=optional || { echo "npm install failed"; exit 1; }

echo "Clone dependencies from github to inner folders."
mkdir -p "${DIR_OWN}/@flancer32/"
mkdir -p "${DIR_OWN}/@flancer64/"
mkdir -p "${DIR_OWN}/@teqfw/"

processRepo "flancer32/teq-cms" &
processRepo "flancer32/teq-tmpl" &
processRepo "flancer32/teq-web" &
processRepo "flancer64/oauth2-social-login" &
processRepo "flancer64/teq-agave-auth-otp" &
processRepo "flancer64/teq-agave-oauth2" &
processRepo "flancer64/teq-agave-otp" &
processRepo "flancer64/teq-agave-paypal" &
processRepo "flancer64/teq-agave-tmpl" &
processRepo "flancer64/teq-agave-web-session" &
processRepo "teqfw/core" &
processRepo "teqfw/db" &
processRepo "teqfw/di" &
processRepo "teqfw/email" &
processRepo "teqfw/test" &
wait

echo ""
echo "App deployment in 'dev' mode is done."
