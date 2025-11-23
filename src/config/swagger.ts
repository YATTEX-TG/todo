import { type Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Todo API',
      version: '1.0.0',
      description: 'REST API для управления задачами с категориями на Node.js и TypeScript',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Проверка здоровья сервера',
      },
      {
        name: 'Todos',
        description: 'Управление задачами',
      },
      {
        name: 'Categories',
        description: 'Управление категориями',
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            title: {
              type: 'string',
              example: 'Изучить TypeScript',
            },
            done: {
              type: 'boolean',
              example: false,
            },
            categoryId: {
              type: 'integer',
              example: 1,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T11:45:00.000Z',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Работа',
            },
            color: {
              type: 'string',
              example: '#ff6b6b',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // путь к файлам с роутерами
};

export default swaggerOptions;
