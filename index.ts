import app from './app';
import http from 'http';

require('dotenv').config()
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(process.env.NODE_ENV);
  console.log(`Server running on port ${PORT}`);
});