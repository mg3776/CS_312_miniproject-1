import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const PORT = 3000;

// middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// in-memory posts storage
let posts = [];
let idCounter = 1;

// home route - list + create form
app.get("/", (req, res) => {
  res.render("index", { posts });
});

// create post
app.post("/posts", (req, res) => {
  const { title, content, author } = req.body;
  posts.push({
    id: idCounter++,
    title,
    content,
    author,
    createdAt: new Date().toLocaleString()
  });
  res.redirect("/");
});

// edit form
app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.send("Post not found");
  res.render("index", { posts, editPost: post });
});

// update post
app.put("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (post) {
    post.title = req.body.title;
    post.content = req.body.content;
    post.author = req.body.author;
  }
  res.redirect("/");
});

// delete post
app.delete("/posts/:id", (req, res) => {
  posts = posts.filter(p => p.id != req.params.id);
  res.redirect("/");
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
