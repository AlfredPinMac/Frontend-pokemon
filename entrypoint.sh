#!/bin/bash
set -e

mkdir -p /var/log/nginx /var/run/fail2ban

# Ensure real access-log file exists and is not a symlink to stdout
rm -f /var/log/nginx/access.log /var/log/nginx/error.log
touch /var/log/nginx/access.log /var/log/nginx/error.log /var/log/fail2ban.log
rm -f /var/run/fail2ban/fail2ban.sock /var/run/fail2ban/fail2ban.pid

# Start Nginx in background
nginx -g 'daemon off;' &
sleep 1

# Start Fail2ban service
fail2ban-client -x start

echo "[pokemon-frontend] Nginx + Fail2Ban running. Following /var/log/fail2ban.log..."
exec tail -F /var/log/fail2ban.log
