#!/bin/sh

if [ ! -f /var/www/docker/.first_run_done ]; then
  echo "First run detected – running setup commands..."
  # Run commands only on first build
  cd /var/www/backend || exit 1
  composer install
  cp .env.example .env
  php artisan key:generate
  php artisan storage:link
  cd ../frontend || exit 1
  npm install
  cd ..
  touch /var/www/docker/.first_run_done
fi

echo "Starting servers..."
php backend/artisan serve --host=0.0.0.0 --port=8000 &
cd frontend &&
npm run dev