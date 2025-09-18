FROM php:8.4-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    libpq-dev \
    libonig-dev \
    libssl-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    libicu-dev \
    libzip-dev \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    pdo_pgsql \
    pgsql \
    opcache \
    intl \
    zip \
    bcmath \
    soap \
    telnet

RUN curl -sL https://deb.nodesource.com/setup_22.x | bash \
    && apt-get install nodejs -y

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
