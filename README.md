# Frontend

This repository contains the frontend services for DogsupTech, specifically serving as the frontend for [Vetz.ai](https://vetz.ai). It is built using modern web development technologies and frameworks to provide a seamless user experience.

The frontend application is live and can be accessed at [Vetz.ai Frontend](https://nextjs-frontend-mzlwcya3uq-nw.a.run.app/).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/dogsupTech/frontend.git
    cd frontend
    ```

2. Install the dependencies using `pnpm`:

    ```bash
    pnpm install
    ```

3. Set up environment variables. Create a `.env` file and add the necessary variables as outlined in the Environment Variables section.

## Usage

1. Start the development server:

    ```bash
    pnpm dev
    ```

2. Build the application for production:

    ```bash
    pnpm build
    ```

## Project Structure

.
├── public # Public assets and index.html
├── src # Source files
│ ├── assets # Images, fonts, and other static assets
│ ├── components # Reusable React components
│ ├── pages # React components for each page
│ ├── services # API service integrations
│ ├── styles # Global and component-specific styles
│ ├── App.js # Main application component
│ ├── index.js # Entry point of the application
│ └── routes.js # Application routing
├── .env # Environment variables file
├── .gitignore # Git ignore file
├── package.json # NPM dependencies and scripts
└── README.md # Project documentation

markdown
Copy code

## API Integration

This frontend application integrates with the backend services provided by the [Backend Repository](https://github.com/dogsupTech/backend). Key integrations include:

- **Consultation Upload**: Interacts with the `/api/v1/upload_consultation` endpoint to handle consultation data.
- **Transcription Services**: Utilizes Whisper for transcribing audio files.

## Environment Variables

The application uses environment variables for configuration. Below are the required variables:

.env file
REACT_APP_API_URL=your_backend_api_url
REACT_APP_WHISPER_API_KEY=your_whisper_api_key

csharp
Copy code

Ensure you create a `.env` file in the root directory and populate it with the required variables.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that your code adheres to the coding standards and includes relevant tests.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
This README provides a comprehensive guide to understanding and using the frontend repository for DogsupTech, now including instructions for using pnpm. Feel free to adjust any specific details or add more sections as needed.
