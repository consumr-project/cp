source script/cli.sh

userflag=""
db_cmd=""

if [ ! -z "$DATABASE_URL" ]; then
    hostname=$(url:parse $DATABASE_URL hostname)
    username=$(url:parse $DATABASE_URL auth | cut -d':' -f 1)
    database=$(node -e "console.log(require('acm')('database.url').split('/').pop())")

    db_cmd="psql $DATABASE_URL"
else
    hostname="$POSTGRES_HOST"
    username="$POSTGRES_USER"
    database="$POSTGRES_DB"

    if [ ! -z "$username" ]; then
        userflag="-U $username"
    fi

    db_cmd="psql -h $hostname $userflag $database -f"
fi

[ -z "$DB_CMD" ] && DB_CMD="$db_cmd"
[ -z "$JS_CMD" ] && JS_CMD="node"
