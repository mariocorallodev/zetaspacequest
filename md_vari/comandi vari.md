# backup
cp App.js App.js.backup.$(date +%Y%m%d_%H%M%S)

# restore
cp App.js.backup.$(date +%Y%m%d_%H%M%S) App.js