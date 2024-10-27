
# Messenger Clone

Brief description of your project.

## Prerequisites

Make sure you have the following installed:

- [Composer](https://getcomposer.org/)
- [Node.js and npm](https://nodejs.org/)

## Installation

### 1. Clone the Repository

Clone the project from GitHub:

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install PHP Dependencies

Run the following command to install the required PHP dependencies using Composer:

```bash
composer install
```

### 3. Set Up the Environment File

Copy the example environment file and create a new `.env` file:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials and other required configuration.

### 4. Generate Application Key

Run the following command to generate a new application key:

```bash
php artisan key:generate
```

### 5. Run Database Migrations

If the project uses a database, run migrations to set up the database structure:

```bash
php artisan migrate
```

### 6. Install Node.js Dependencies

Install the frontend dependencies (Vue.js, etc.) using npm:

```bash
npm install
```

### 7. Compile Assets

Compile the frontend assets using Laravel Mix:

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
```

### 8. Serve the Application

Start the Laravel development server:

```bash
php artisan serve
```

Open your browser and navigate to `http://localhost:8000`.


