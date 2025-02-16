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
    - [Step 4 - Start the development](#step-4---start-the-development)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [License](#license)
- [Contact](#contact)
    - [TODO](#todo)

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

You can use npm or another package manager

```bash
npm install
```

## Step 3 - Set up environment variables

copy `.env.example` to `.env`

`VITE_BASE_URL` is your backend container URL
`VITE_JWT_SECRET_KEY` is backend JWT secret key

```bash
VITE_BASE_URL=
VITE_JWT_SECRET_KEY=
```

## Step 4 - Start the development

```bash
npm run dev
```

# Usage

# Folder Structure

# License

This project is licensed under the [MIT License](/LICENSE).

# Contact

We'd love to hear from you! If you have any questions, suggestions, or feedback about this project, feel free to reach out.

- **Email**: [pthu1@kmd.edu.mm](mailto:pthu1@kmd.edu.mm)

## TODO

- Fix timer in resend OTP code
- Forgot password is not work without login (show refresh token error)
