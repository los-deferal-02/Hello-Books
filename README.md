[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)
[![Coverage Status](https://coveralls.io/repos/github/los-deferal-02/Hello-Books/badge.svg?branch=develop)](https://coveralls.io/github/los-deferal-02/Hello-Books?branch=develop)


# Hello-Books

A Book Library Management System

## Getting Started

**Development**

To clone and run this application, you'll need [Git](https://git-scm.com) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/los-deferal-02/Hello-Books.git
```

Refer to the [.env_sample](.env_sample) file for the required environment variables to get the application up and running.

## Installation

To run this application in development mode, you'll need [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Enter the project directory
$ cd Hello-Books

# Install dependencies
$ npm install

# Start the development server
$ npm run start-dev

```

When the development server is up and running (i.e displays a success message on your command line), you can test the server response by visiting the following endpoint using Postman:

`GET localhost:4000/`

## API Endpoints

A full Swagger documentation on the available API endpoints can be found by running the visiting the base URL of the app with the `/api-docs` suffix. E.g while the server is running in development mode, the API documentation will be viewable at `localhost:4000/api-docs`

