import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

// Initializing the CORS middleware
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
  origin: '*', // Allow all origins, you can specify certain origins if needed
  optionsSuccessStatus: 200,
});

// Helper method to wait for the middleware to execute before continuing
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: (req: NextApiRequest, res: NextApiResponse, callback: (result: any) => void) => void) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default cors;
export { runMiddleware };
