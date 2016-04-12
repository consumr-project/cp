#!/bin/bash

CACHE_ADDONS=
CACHE_ENVVAR=
CACHE_BUILDP=

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

        heroku:buildpacks)
            log "getting heroku buildpack information"
            CACHE_BUILDP=$(heroku buildpacks)
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

heroku:buildpack() {
    local name=$1

    echo $CACHE_BUILDP | grep "$name" &> /dev/null
    if [ "$?" -ne 0 ]; then
        log "setting $name buildpack"
        heroku buildpacks:add "$name" &> /dev/null
        logstat
    else
        log "using $name buildpack"
        logstat
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
    local val=$2

    echo $CACHE_ENVVAR | grep "$name" &> /dev/null
    if [ "$?" -ne 0 ]; then
        if [ -z "$val" ]; then
            log "set $name:"
            read -s val
            logstat
        fi

        log "pushing $name"
        heroku config:set "$name=$val" &> /dev/null
        logstat
    else
        log "environment variable $name is set"
        logstat
    fi
}
