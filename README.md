## Table of Content

- [Overview](#overview)
- [Pre-request](#pre-request)
- [Installation](#installation)
  - [Step 1 - Clone Frontend Project](#step-1---clone-frontend-project)
    - [with **SSH**](#with-ssh)
    - [with **HTTPS**](#with-https)
    - [Navigate to the project directory](#navigate-to-the-project-directory)
  - [Step 2 - Install dependencies](#step-2---install-dependencies)
  - [Step 3 - Set up environment variables](#step-3---set-up-environment-variables)
  - [Step 4 - Install necessary packages](#step-4---install-necessary-packages)
  - [Step 5 - Start the development](#step-5---start-the-development)
  - [Step 6 - Run with Docker](#step-6---run-with-docker)
- [Folder Structure](#folder-structure)
- [Contact](#contact)
- [License](#license)

# Overview

# Pre-request

**Node Version:** `18.16.0 (LTS)`

# Installation

## Step 1 - Clone Frontend Project

### with **SSH**

```bash
  git clone git@github.com:EWSD-Group-3-2025/frontend.git
```

### with **HTTPS**

```bash
git clone https://github.com/EWSD-Group-3-2025/frontend.git
```

### Navigate to the project directory

```bash
cd frontend
```

## Step 2 - Install dependencies

Please use Pnpm as package manager to solve peer dependency issues

```bash
npm install -g pnpm

# For linux for mac os, sudo permission will need
# sudo npm install -g pnpm
```

## Step 3 - Set up environment variables

copy `.env.example` to `.env`

`VITE_BASE_URL` is your backend container URL
`VITE_BACKEND_WEB_SOCKET_BASE_URL` is backend Web Socket Connection URL
`VITE_UPLOADCARE_PUBLISH_KEY` is image upload API KEY

```bash
VITE_BASE_URL=
VITE_BACKEND_WEB_SOCKET_BASE_URL=
VITE_UPLOADCARE_PUBLISH_KEY=
```

## Step 4 - Install necessary packages

```bash
pnpm install
```

## Step 5 - Start the development

```bash
pnpm run dev
```

**OR**

## Step 6 - Run with Docker

Ensure Docker is installed on your system. Then, run the following commands:

1. Build the Docker image:

    ```bash
    docker compose -f ./docker/docker-compose.yml build
    ```

2. Start the application:

    ```bash
    docker compose -f ./docker/docker-compose.yml up -d
    ```

3. To stop the application:
    ```bash
    docker compose down
    ```

# Folder Structure

The project structure is organized as follows:

```
frontend/
├── .github/            # GitHub-specific configuration files
├── .husky/             # Husky hooks for Git
├── docker/             # Docker-related files
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, fonts, and other static resources
│   ├── components/     # Reusable UI components
│   ├── context/        # React context files
│   ├── features/       # Feature-specific modules
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Layout components
│   ├── pages/          # Application pages
│   ├── router/         # Routing configuration
│   ├── store/          # State management (e.g., Redux, Zustand)
│   ├── templates/      # Template files
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   ├── constants.ts    # Application constants
│   ├── data.ts         # Mock or static data
│   ├── index.css       # Global styles
│   ├── main.tsx        # Application entry point
│   └── vite-env.d.ts   # Vite environment types
├── .env.example        # Environment variable template
├── .gitignore          # Git ignore rules
├── .prettierrc.json    # Prettier configuration
├── components.json     # Component metadata
├── eslint.config.js    # ESLint configuration
├── index.html          # HTML entry point
├── LICENSE             # License file
├── package.json        # Project dependencies and scripts
├── pnpm-lock.yaml      # Dependency lock file
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.app.json   # TypeScript configuration for the app
├── tsconfig.json       # Base TypeScript configuration
├── tsconfig.node.json  # TypeScript configuration for Node.js
├── vercel.json         # Vercel deployment configuration
└── vite.config.ts      # Vite configuration
```

# Contact

We'd love to hear from you! If you have any questions, suggestions, or feedback about this project, feel free to reach out.

- **Email**: [teamsmurfs2025@gmail.com](mailto:teamsmurfs2025@gmail.com)

# License

This project is licensed under the [MIT License](/LICENSE).
