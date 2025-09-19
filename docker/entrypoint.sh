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
cd ..

echo "Starting servers..."
php backend/artisan serve --host=0.0.0.0 --port=8000 &
cd frontend &&
npm run dev