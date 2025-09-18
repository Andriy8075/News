#!/bin/sh

if [ ! -f /var/www/.first_run_done ]; then
  echo "First run detected – running setup commands..."
  # Run commands only on first build
  composer install
  cp .env.example .env
  php artisan key:generate
  php artisan storage:link
  npm install --prefix frontend
  touch /var/www/.first_run_done
fi

echo "Starting servers..."
php backend/artisan serve --host=0.0.0.0 --port=8000 &
npm run dev --prefix frontend