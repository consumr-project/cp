config() {
    echo $(node -e "console.log(require('acm')('$1'))")
}

config_databasename() {
    echo $(node -e "console.log(require('acm')('database.url').split('/').pop())")
}

# [ -z "$DB_CMD" ] && DB_CMD="psql $(config_databasename) -f"
DB_CMD="psql mtest2 -f"
