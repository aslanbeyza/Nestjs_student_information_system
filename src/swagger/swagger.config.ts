import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('School Management API')
    .setDescription('School Management System API Documentation')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('teachers', 'Teacher management endpoints')
    .addTag('students', 'Student management endpoints')
    .addTag('courses', 'Course management endpoints')
    .addTag('grades', 'Grade management endpoints')
    .addTag('attendance', 'Attendance management endpoints')
    .addTag('classes', 'Class management endpoints')
    .addTag('student-courses', 'Student-Course relationship endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customfavIcon: 'https://nestjs.com/img/favicon.ico',
    customSiteTitle: 'School Management API Docs',
  });
}
