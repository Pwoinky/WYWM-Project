import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./database";
import { productRouter} from "./product.routes";
import { booksRouter } from "./book.routes";
import { userRouter } from "./users/user.routes";


// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config();

const { ATLAS_URI } = process.env;

if (!ATLAS_URI) {
  console.error(
    "No ATLAS_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}

connectToDatabase(ATLAS_URI)
  .then(() => {
    const app = express();
    app.use(cors());
    app.use("/products", productRouter);
    app.use("/books", booksRouter);
    app.use("/users", userRouter);

    // start the Express server
    app.listen(5200, () => {
      console.log(`Server running at http://localhost:5200...`);
    });
  })
  .catch((error) => console.error(error));
