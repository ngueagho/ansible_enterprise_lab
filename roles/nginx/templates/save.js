# Bloc de serveur pour HTTP (port 80)
server {
    listen 80;
    server_name {{item.domain_name}}.propentatech.com www.{{item.domain_name}}.propentatech.com;

    # Redirection de toutes les requêtes HTTP vers HTTPS
    return 301 https://$host$request_uri;
}

# Bloc de serveur pour HTTPS (port 443)
server {
    listen 443 ssl;
    server_name {{item.domain_name}}.propentatech.com www.{{item.domain_name}}.propentatech.com;

    # Configuration SSL (certificat Let's Encrypt par exemple)
    # ssl_certificate /etc/letsencrypt/live/{{item.domain_name}}.propentatech.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/{{item.domain_name}}.propentatech.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Protection contre les attaques
    add_header X-Frame-Options "SAMEORIGIN" always;  # Protection contre le clickjacking
    add_header X-Content-Type-Options "nosniff" always;  # Protection contre l'interprétation erronée du type de contenu
    add_header X-XSS-Protection "1; mode=block" always;  # Protection contre les attaques XSS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;  # HSTS pour forcer HTTPS
    add_header Referrer-Policy "no-referrer-when-downgrade" always;  # Contrôle du comportement du referrer
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; object-src 'none';" always;  # Protection CSP contre XSS et autres injections

    # Dossier racine du site web
    root /var/www/{{item.domain_name}};
    index index.html;

    # Configuration du site
    location / {
        try_files $uri $uri/ =404;
    }


}
