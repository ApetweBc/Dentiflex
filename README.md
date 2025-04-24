# Dentiflex

A web-based 3D viewer application for dental files with sharing and Measuring capabilities

## Features

- 3D STL file viewer with measurement tools
- File sharing functionality
- Distance, angle, and area measurements
- Cross-browser compatibility
- Cloud-based file access
- Real-time collaborative viewing

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager

### Development Setup

1. Clone the repository and install dependencies:

```bash
npm install
# or
yarn install
```

2. Create .env file add:
AWS_ACCESS_KEY_ID=*****
AWS_SECRET_ACCESS_KEY=********
AWS_REGION=********
S3_BUCKET_NAME=********

3. Build app npm run build


4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Docker Deployment

To run the application using Docker:

```bash
docker compose up --build
```

The application will be available at [http://localhost:8000](http://localhost:8000).

## Project Structure

- `/src/pages` - Next.js page components
- `/src/Threejs` - 3D viewer components and utilities
- `/public` - Static assets
- `/api` - API route handlers

## Technology Stack

- [Next.js](https://nextjs.org/) - React framework
- Three.js - 3D graphics library
- Docker - Containerization
- TailwindCSS - Styling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

[MIT License](LICENSE)
