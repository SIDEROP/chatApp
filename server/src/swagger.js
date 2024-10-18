import swaggerAutogen from 'swagger-autogen';
import fs from 'fs';
import path from 'path';

const paths = [
  { basePath: 'user', routes: ['./routes/userRoutes.js'] },
  { basePath: 'admin', routes: ['./routes/adminRoutes.js'] },
  { basePath: 'doctor', routes: ['./routes/doctorRoutes.js'] },
];

const doc = {
  info: {
    title: 'My API',
    description: 'API documentation for all endpoints',
  },
  host: 'localhost:4000',
  basePath: '/api/v1',
};

const generateSwaggerDoc = async () => {
  const outputFile = './api-docs/swagger-output.json';

  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
  }

  for (const { basePath, routes } of paths) {
    try {
      await swaggerAutogen(outputFile, routes, {
        ...doc,
        basePath: `${doc.basePath}/${basePath}`,
      });
      console.log(`Swagger file updated with ${basePath} endpoints`);
    } catch (error) {
      console.error(`Error generating Swagger file for ${basePath}:`, error);
    }
  }
};

generateSwaggerDoc();
