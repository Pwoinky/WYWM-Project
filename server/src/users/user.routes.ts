import * as express from "express";
import * as mongodb from "mongodb";
import { userCollection } from "../database";

export const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get("/", async (_req, res) => {
  try {
    const users = await userCollection.users.find({}).toArray();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new mongodb.ObjectId(id) };
    const product = await userCollection.users.findOne(query);

    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send(`Failed to find an user with id ${id}`);
    }

  } catch (error) {
    res.status(404).send(`Failed to find an user with id ${req?.params.id}`);
  }
});

userRouter.post("/", async (req, res) => {
  try {
    const product = req.body;
    const result = await userCollection.users.insertOne(product);

    if (result.acknowledged) {
      res.status(201).send(`Created a new user with id ${result.insertedId}.`);
    } else {
      res.status(500).send(`Failed to create a new user with id ${result.insertedId}.`);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

userRouter.put("/:id", async (req, res) => {
  try {
    const id = req?.params?.id;
    const product = req.body;
    const query = { _id: new mongodb.ObjectId(id) };
    const result = await userCollection.users.updateOne(query, { $set: product });

    if (result && result.matchedCount) {
      res.status(200).send(`Updated a user with id ${id}.`);
    } else if (!result.matchedCount) {
      res.status(404).send(`Failed to find a user with id ${id}.`);
    } else {
      res.status(304).send(`Failed to update a user with id ${id}.`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {
      const id = req?.params?.id;
      const query = { _id: new mongodb.ObjectId(id) };
      const result = await userCollection.users.deleteOne(query);

      if (result && result.deletedCount) {
          res.status(202).send(`Removed an user: ID ${id}`);
      } else if (!result) {
          res.status(400).send(`Failed to remove an user: ID ${id}`);
      } else if (!result.deletedCount) {
          res.status(404).send(`Failed to find an user: ID ${id}`);
      }
  } catch (error) {
      console.error(error.message);
      res.status(400).send(error.message);
  }
});