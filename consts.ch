# Database configuration
# Could be mysql
$DATABASE_TYPE sqlite
$DATABASE_NAME data.db
# Works only for mysql
$DATABASE_HOST 127.0.0.1
$DATABASE_USER root
$DATABASE_PASSWORD 

# Directory to store files in
$DATA_DIR ./data

# Web server params
$HOST 0.0.0.0
$PORT 6102
$WEB_APP_ROOT ./web

# Api Authentication params
$API_AUTH basic
$API_USERNAME auqi
$API_PASSWORD @nq!

# Logs directory
$LOGS_DIR ./logs

# Project Statuses
$NEW 0 # -> $TODO , -> $STARTED
$TODO 1 # -> $STARTED
$STARTED 2 # -> $PAUSED , -> $TESTING, -> $FINISHED, -> $ABANDONED
$PAUSED 3 # -> $STARTED
$TESTING 4 # -> $FINISHED , -> $STARTED
$FINISHED 5
$ABANDONED 6