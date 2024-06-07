// utils/cors.ts
import Cors from 'cors';

// Initializing the CORS middleware
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
  origin: '*', // Allow all origins, you can specify certain origins if needed
  optionsSuccessStatus: 200,
});

// Helper method to wait for the middleware to execute before continuing
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default cors;
export { runMiddleware };
