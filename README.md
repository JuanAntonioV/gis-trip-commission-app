# Laravel 12 with Inertia React Setup Guide

This guide provides step-by-step instructions to set up a Laravel 12 project with Inertia.js and React. Follow the steps below to get started.

---

## Prerequisites

Ensure the following software is installed on your system:

1. **PHP** (>= 8.1)  
   Install PHP from [php.net](https://www.php.net/downloads) or use a package manager.
    - **macOS** (Homebrew):
        ```bash
        brew install php
        ```
    - **Ubuntu**:
        ```bash
        sudo apt update
        sudo apt install php-cli php-mbstring php-xml php-bcmath php-curl
        ```
    - **Windows**:  
      Download and install PHP from [php.net](https://www.php.net/downloads). Add PHP to your system's PATH.

2. **Git**  
   Install Git from [git-scm.com](https://git-scm.com/).
    - **macOS** (Homebrew):
        ```bash
        brew install git
        ```
    - **Ubuntu**:
        ```bash
        sudo apt install git
        ```
    - **Windows**:  
      Download and install Git from [git-scm.com](https://git-scm.com/).

3. **MySQL**  
   Install MySQL from [mysql.com](https://dev.mysql.com/downloads/).
    - **macOS** (Homebrew):
        ```bash
        brew install mysql
        ```
    - **Ubuntu**:
        ```bash
        sudo apt install mysql-server
        ```
    - **Windows**:  
      Download and install MySQL from [mysql.com](https://dev.mysql.com/downloads/installer/).

4. **Node.js** (>= 18.x) and npm  
   Install Node.js from [nodejs.org](https://nodejs.org/).
    - **macOS** (Homebrew):
        ```bash
        brew install node
        ```
    - **Ubuntu**:
        ```bash
        sudo apt install nodejs npm
        ```
    - **Windows**:  
      Download and install Node.js from [nodejs.org](https://nodejs.org/).

5. **Composer**  
   Install Composer from [getcomposer.org](https://getcomposer.org/).
    - **macOS/Linux**:
        ```bash
        curl -sS https://getcomposer.org/installer | php
        sudo mv composer.phar /usr/local/bin/composer
        ```
    - **Windows**:  
      Download and install Composer from [getcomposer.org](https://getcomposer.org/). Ensure it is added to your system's PATH.

---

## Project Setup

1. **Clone the Repository**  
   Clone the project repository to your local machine.

    ```bash
    git clone git@github.com:JuanAntonioV/gis-trip-commission-app.git
    cd gis-trip-commission-app
    ```

2. **Install PHP Dependencies**  
   Use Composer to install the required PHP dependencies.

    ```bash
    composer install
    ```

3. **Install Node.js Dependencies**  
   Use npm to install the required JavaScript dependencies.

    ```bash
    npm install
    ```

4. **Set Up Environment Variables**  
   Copy the `.env.example` file to `.env` and configure your database settings:

    ```bash
    cp .env.example .env
    ```

    Update the following lines in the `.env` file:

    ```
    DB_DATABASE=your_database_name
    DB_USERNAME=your_database_user
    DB_PASSWORD=your_database_password
    ```

5. **Generate Application Key**  
   Generate the application key for your Laravel project.

    ```bash
    php artisan key:generate
    ```

6. **Run Migrations**  
   Run the database migrations to set up the database schema.

    ```bash
    php artisan migrate
    ```

7. **Build Frontend Assets**  
   Compile the frontend assets using the following command:

    ```bash
    npm run dev
    ```

---

## Running the Application

Start the development server:

```bash
composer run dev
```

Visit the application in your browser at [http://localhost:8000](http://localhost:8000).

---

## Additional Commands

- **Run in Watch Mode**:  
  To automatically rebuild assets on file changes, use:

    ```bash
    npm run watch
    ```

- **Build for Production**:  
  To compile assets for production, use:

    ```bash
    npm run build
    ```

---

You're all set! Enjoy building with Laravel 12 and Inertia.js.
