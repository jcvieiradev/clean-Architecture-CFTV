import express from 'express';
import { IndexHandler } from './Colaborador/Controller/IndexHandler';
import { Service } from './Colaborador/UseCase/Service';
import { DatabaseRepository } from './Colaborador/Adapter/DatabaseRepository';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dependency Injection
const repository = new DatabaseRepository();
const service = new Service(repository);
const indexHandler = new IndexHandler(service);

// Routes
app.get('/colaboradores', (req, res) => indexHandler.handle(req, res));

app.get('/', (req, res) => {
  res.json({
    message: 'API CFTV - Clean Architecture',
    endpoints: {
      'GET /colaboradores': 'Lista todos os colaboradores'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
