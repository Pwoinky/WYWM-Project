import * as express from "express";
import * as mongodb from "mongodb";
import { bookCollection } from "./database";

export const booksRouter = express.Router();
booksRouter.use(express.json());

booksRouter.get("/", async (_req, res) => {
  try {
    const books = await bookCollection.books.find({}).toArray();
    res.status(200).send(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

booksRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new mongodb.ObjectId(id) };
    const product = await bookCollection.books.findOne(query);

    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send(`Failed to find an book with id ${id}`);
    }

  } catch (error) {
    res.status(404).send(`Failed to find an book with id ${req?.params.id}`);
  }
});

booksRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    const result = await bookCollection.books.insertOne(product);

    if (result.acknowledged) {
      res.status(201).send(`Created a new book with id ${result.insertedId}.`);
    } else {
      res.status(500).send(`Failed to create a new book with id ${result.insertedId}.`);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

booksRouter.put("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const product = req.body;
    const query = { _id: new mongodb.ObjectId(id) };
    const result = await bookCollection.books.updateOne(query, { $set: product });

    if (result && result.matchedCount) {
      res.status(200).send(`Updated a book with id ${id}.`);
    } else if (!result.matchedCount) {
      res.status(404).send(`Failed to find a book with id ${id}.`);
    } else {
      res.status(304).send(`Failed to update a book with id ${id}.`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});

booksRouter.delete("/:id", async (req, res) => {
  try {
      const id = req?.params?.id;
      const query = { _id: new mongodb.ObjectId(id) };
      const result = await bookCollection.books.deleteOne(query);

      if (result && result.deletedCount) {
          res.status(202).send(`Removed an book: ID ${id}`);
      } else if (!result) {
          res.status(400).send(`Failed to remove an book: ID ${id}`);
      } else if (!result.deletedCount) {
          res.status(404).send(`Failed to find an book: ID ${id}`);
      }
  } catch (error) {
      console.error(error.message);
      res.status(400).send(error.message);
  }
});