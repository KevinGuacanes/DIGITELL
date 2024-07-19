<h1>Digitell</h1>

## Instalación

1. Clonar repositorio.
   ```sh
   git clone https://github.com/Jordi021/Digitell-Project.git Digitell 
   cd Digitell
   code .

2. Backend
    ```sh
    composer install
    cp .env.example .env
    php artisan key:generate
    php artisan migrate --seed
    php artisan serve

3. Frontend
    ```sh
    npm install
    npm run dev
    
## Usuarios del Sistema

| Nombre         | Nombre de Usuario | Email               | Contraseña  |
|----------------|-------------------|---------------------|-------------|
| Super User     | superuser         | su@example.com      | password    |
| Admin User     | admin             | admin@example.com   | password    |
| Vendedor User  | vender            | vendedor@example.com| password    |
| Tecnico User   | tecni             | tecnico@example.com | password    |
| Auditor User   | audi              | auditor@example.com | password    |