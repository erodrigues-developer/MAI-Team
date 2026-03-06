import { createApp } from './app';

const PORT = process.env.PORT ?? 3000;

const app = createApp();

app.listen(PORT, () => {
  const ts = new Date().toISOString();
  console.log(`[INFO] ${ts} Server listening on port ${PORT}`);
});
