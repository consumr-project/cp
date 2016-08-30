source script/cli.sh

userflag=""

if [ ! -z "$DATABASE_URL" ]; then
    hostname=$(url:parse $DATABASE_URL hostname)
    username=$(url:parse $DATABASE_URL auth | cut -d':' -f 1)
    database=$(node -e "console.log(require('acm')('database.url').split('/').pop())")
else
    hostname="$POSTGRES_HOST"
    username="$POSTGRES_USER"
    database="$POSTGRES_DB"
fi

if [ ! -z "$username" ]; then
    userflag="-U $username"
fi

[ -z "$DB_CMD" ] && DB_CMD="psql -h $hostname $userflag $database -f"
[ -z "$JS_CMD" ] && JS_CMD="node"
