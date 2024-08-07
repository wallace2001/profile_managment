#!/bin/sh

# Define o diretório de trabalho
cd /var/www/html

# Instala as dependências do Composer
composer install --no-interaction --prefer-dist --optimize-autoloader

# Gera a chave da aplicação
php artisan key:generate

# Executa as migrações e seeds do banco de dados
php artisan migrate:fresh --force
php artisan db:seed --force

# Cria o link simbólico para o diretório de armazenamento
php artisan storage:link

# Limpando o cache de configuração
php artisan config:cache

# Inicia o supervisord para gerenciar processos, incluindo PHP-FPM
exec supervisord -c /etc/supervisor/supervisord.conf
