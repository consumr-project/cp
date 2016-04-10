#!/bin/bash

CACHE_ADDONS=
CACHE_ENVVAR=

use() {
    case "$1" in
        heroku:env)
            log "getting heroku environment information"
            CACHE_ENVVAR=$(heroku run printenv 2> /dev/null)
            logstat
            ;;

        heroku:addons)
            log "getting heroku addon information"
            CACHE_ADDONS=$(heroku addons)
            logstat
            ;;
    esac
}

log() {
    echo -n "  - $@"
}

logstat() {
    local last=$?
    local force=$1

    [ ! -z "$force" ] && last="$force"

    if [ "$last" -eq 0 ]; then
        echo " [ok]"
    else
        echo " [err]"
    fi
}

heroku:addon() {
    local name=$1
    local version=$2

    echo $CACHE_ADDONS | grep "$name" &> /dev/null
    if [ "$?" -ne 0 ]; then
        log "installing $name:$version addon"
        heroku addons:create "$name:$version" &> /dev/null
        logstat
    else
        log "found $name:$version addon"
        logstat
    fi
}

heroku:envar() {
    local name=$1
    local val=

    echo $CACHE_ENVVAR | grep "$name" &> /dev/null
    if [ "$?" -ne 0 ]; then
        log "set $name:"
        read -s val
        logstat

        log "pushing $name"
        heroku config:set "$name=$val" &> /dev/null
        logstat
    else
        log "environment variable $name is set"
        logstat
    fi
}
