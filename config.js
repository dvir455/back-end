const cryptrSecret = 'dvir'
const corsOptions = {
    origin: [
      'http://127.0.0.1:3030',
      'http://localhost:3030',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
    ],
    credentials: true,
  };
module.exports = {
    cryptrSecret,
    corsOptions
}