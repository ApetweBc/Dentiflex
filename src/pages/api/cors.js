import Cors from "cors";

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
  origin: ["http://localhost:3000", "your-production-domain.com"],
  credentials: true,
});

export function runCorsMiddleware(req, res) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
