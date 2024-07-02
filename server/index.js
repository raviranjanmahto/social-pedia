require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const dbConnect = require("./config/dbConnect");
const errorGlobalMiddleware = require("./middlewares/errorMiddleware");
const AppError = require("./utils/appError");

const PORT = process.env.PORT || 7016;

const app = express();

// Allowing cross-origin requests from front-end
const corsOptions = {
  origin: "https://front-end-url-paste-here.vercel.app",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// CORS middleware for all routes that need it to be permitted to access the server
// app.use(cors(corsOptions));
app.use(cors());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Set security HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Development logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Database connection
dbConnect(process.env.DATABASE_URI);

// health check
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "Server is listening..." });
});

// Routes

// 404 error handler for all other routes
app.all("*", (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
);

// Global error handler
app.use(errorGlobalMiddleware);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));
