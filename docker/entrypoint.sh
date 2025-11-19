#!/bin/sh

cd /var/www/backend || exit 1
composer install
if [ ! -f /var/www/backend/.env ]; then
  cp .env.example .env
fi
php artisan key:generate
php artisan storage:link
php artisan migrate

cd ../frontend || exit 1
npm install

# Ensure Vite's file watcher sees changes from the host filesystem (especially on Windows/macOS)
export CHOKIDAR_USEPOLLING=1
export CHOKIDAR_INTERVAL=100
export VITE_DEV_SERVER_POLLING=100

cd ..

echo "Starting servers..."
php backend/artisan serve --host=0.0.0.0 --port=8000 &
cd frontend
if [ ! -f /var/www/frontend/.env ]; then
  cp .env.example .env
fi
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort