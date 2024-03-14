import "dotenv/config";
import express from "express";

const app = express();
const port = process.env.PORT || 3001;

//rest of the package
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());

app.use(express.static("./public"));

//routes
import userRouter from "./src/routes/user.route.js";
import postRouter from "./src/routes/post.route.js";
import followRouter from "./src/routes/follow.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/network", followRouter);

//not foud
import notFound from "./src/utils/notFound.js";

app.use(notFound);

//database
import connectDB from "./src/db/index.js";

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`app is listening on port ${port}`);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
