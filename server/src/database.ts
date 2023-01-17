import * as mongodb from "mongodb";
import { Shirts } from "./product";
import { Books } from "./books";
import { Users } from "./users/users";


export const collections: {
  products?: mongodb.Collection<Shirts>;
} = {};

export const bookCollection: {
  books?: mongodb.Collection<Books>;
} = {};

export const userCollection: {
  users?: mongodb.Collection<Users>;
} = {};


export async function connectToDatabase(uri: string) {
  const client = new mongodb.MongoClient(uri);
  await client.connect();

  const db = client.db("products");
  await applySchemaValidation(db);

  const productsCollection = db.collection<Shirts>("shirts");
  collections.products = productsCollection;
  console.log(productsCollection);

  const booksCollection = db.collection<Books>("books");
  bookCollection.books = booksCollection;
  console.log(booksCollection);

  const usersCollection = db.collection<Users>("users");
  userCollection.users = usersCollection;
  console.log(usersCollection);

}

async function applySchemaValidation(db: mongodb.Db) {
  const productJsonSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "name", "image", "price"],
      additionalProperties: false,
      properties: {
        _id: {},
        id: { bsonType: "string", description: "'A Product ID is needed'" },

        name: {
          bsonType: "string",
          description: "'Product name is required.'"
          ,
        },
        image: {
          bsonType: "string",
          description: "'An image is required.'",
          minLength: 5
        },
        price: {
          bsonType: "number",
          description: "'A Price is required.'",
        },
      },
    },
  };
  const userJsonSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password", "role"],

      additionalProperties: false,
      properties: {
        _id: {},
        name: {
          bsonType: "string",
          description: "'User name is required.'"
          ,
        },
        email: {
          bsonType: "string",
          description: "'An Email is required.'",
          minLength: 5
        },
        password: {
          bsonType: "string",

          description: "'A Password is required.'",
        },
        role: {
          bsonType: "string",
          description: "'A Role is required.'",
        },
      },
    },
  };

  // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db.command({
    collMod: "products",
    validator: productJsonSchema || userJsonSchema,
  }).catch(async (error: mongodb.MongoServerError) => {
    if (error.codeName === 'NamespaceNotFound') {
      await db.createCollection("products", { validator: productJsonSchema || userJsonSchema});
    }
  });
}
