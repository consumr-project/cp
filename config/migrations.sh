source scripts/cli.sh

hostname=$(url:parse $DATABASE_URL hostname)
username=$(url:parse $DATABASE_URL auth | cut -d'_' -f 1)
database=$(node -e "console.log(require('acm')('database.url').split('/').pop())")
userflag=""

if [ ! -z "$username" ]; then
    userflag="-U $username"
fi

[ -z "$DB_CMD" ] && DB_CMD="psql -h $hostname $userflag $database -f"
