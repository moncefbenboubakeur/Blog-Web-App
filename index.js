import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const posts = [];
let tempPost = {};

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
  //   res.sendStatus(200);
});

// This route should only display the form and not process any POST data.
app.all("/create", (req, res, next) => {
  console.log(`Accessed /create via ${req.method}`);
  next();
});

app.get("/create", (req, res) => {
  console.log("Loading form for /create");
  res.render("create.ejs", {
    tempPost: { postName: "", postDate: "", postContent: "" },
  });
});

function printPosts() {
  for (var i = 0; i < posts.length; i++) {
    console.log(
      "Posts array " +
        [i] +
        " " +
        posts[i].postName +
        " " +
        posts[i].postDate +
        " " +
        posts[i].postContent
    );
  }
}

// This route handles the form submission.
app.post("/create", (req, res) => {
  const { postName, postDate, postContent } = req.body;
  console.log("Received post data:", { postName, postDate, postContent });

  if (postName) {
    console.log("Valid postName, redirecting...");
    posts.push(req.body);
    printPosts();
    res.redirect(`/success?postName=${encodeURIComponent(postName)}`);
  } else {
    console.log("Missing postName, rendering form again...");
    res.render("create.ejs", { tempPost: { postName, postDate, postContent } });
  }
});

app.get("/success", (req, res) => {
  const postName = req.query.postName; // This captures the 'postName' from the query string
  res.render("success", { postName: postName });
});

app.get("/view", (req, res) => {
  console.log("Loaded posts:", posts);
  res.render("view.ejs", { listPosts: posts });
});

app.get("/update", (req, res) => {
  console.log("Loaded posts:", posts);
  res.render("update.ejs", { listPosts: posts });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
