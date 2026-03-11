import express from 'express';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import taskRoutes from './routes/taskRoutes';

const app = express();

// Middleware
app.use(express.json({ limit: '10kb' })); // Body parser with size limit for security
app.use(requestLogger);

// Routes
app.use('/', taskRoutes);

// Error handling (must be last)
app.use(errorHandler);

export default app;