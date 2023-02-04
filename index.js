import express from "express";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { db, auth } from "./firebase.js";

const app = express();

// Body parser
app.use(express.json());

// collection reference
const booksRef = collection(db, "books");

// firebase queries
const authorQuery = query(
  booksRef,
  where("author", "==", "unknown"),
  orderBy("title", "asc")
);
const latestBookQuery = query(booksRef, orderBy("createdAt", "desc"));

// Home route
app.get("/", (req, res) => {
  res.send("Cool...");
});

// FIRESTORE

// Get books
app.get("/firebase/books", (req, res) => {
  getDocs(booksRef)
    .then((snapshot) => {
      const books = [];
      snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id });
      });
      res.json(books);
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// Get single doc
app.get("/firebase/books/:id", (req, res) => {
  const docRef = doc(db, "books", req.params.id);

  getDoc(docRef).then((doc) => {
    res.json({ ...doc.data(), id: doc.id });
  });
});

// Create books
app.post("/firebase/books", (req, res) => {
  addDoc(booksRef, {
    title: req.body.title,
    author: req.body.author,
    createdAt: serverTimestamp(),
  })
    .then(() => res.status(201).json("Book added"))
    .catch((err) => console.log(err));
});

// Update book
app.put("/firebase/books/:id", (req, res) => {
  const docRef = doc(db, "books", req.params.id);
  updateDoc(docRef, {
    title: req.body.title,
    author: req.body.author,
  }).then(() => {
    getDoc(docRef).then((doc) => {
      res.json({ ...doc.data(), id: doc.id });
    });
  });
});

// Delete book
app.delete("/firebase/books/:id", (req, res) => {
  const docRef = doc(db, "books", req.params.id);
  deleteDoc(docRef)
    .then(() => res.json("Book deleted!"))
    .catch((err) => console.log(err));
});

// Realtime data
// Get collection snapshot
const unsubCol = onSnapshot(latestBookQuery, (snapshot) => {
  const books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log({ books });
});

// Get document snapshot
const docRef = doc(db, "books", "6mSoXUrDqsEHzcp6NXaS");
const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log({ ...doc.data(), id: doc.id });
});

// AUTHENTICATION
// Register new user
app.post("/firebase/auth/signup", async (req, res) => {
  try {
    const signup = await createUserWithEmailAndPassword(
      auth,
      req.body.email,
      req.body.password
    );
    res.status(201).json(signup);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Logout user
app.get("/firebase/auth/signout", async (req, res) => {
  try {
    await signOut(auth);
    res.status(200).json({
      msg: "User successfully logged out!",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Login user
app.post("/firebase/auth/signin", async (req, res) => {
  try {
    const cred = await signInWithEmailAndPassword(
      auth,
      req.body.email,
      req.body.password
    );
    res.status(200).json(cred);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Subscribe to auth state change
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log({ user });
});

// Unsubscribe
app.get("/firebase/unsubscribe/all", (req, res) => {
  unsubAuth();
  unsubCol();
  unsubDoc();
  res.send("Unsubscribed!");
});

app.listen(3000, () => console.log("Listening on port 3000..."));
