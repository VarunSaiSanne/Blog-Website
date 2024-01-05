const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Blog = require("./blog");

mongoose.connect("mongodb://localhost:27017/users")
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log(err.message);
  });

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.get('/', (req, res) => {
    res.redirect('/add-blog');
});

app.get("/show-blogs", async (req, res) => {
    try {
        const allBlogs = await Blog.find({});
        console.log(allBlogs);
        res.render('Show_blogs', { allBlogs });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching blogs');
    }
});

app.get('/add-blog', (req, res) => {
    res.render("add_item");
});

app.post('/add-blog', async (req, res) => {
    try {
        const { fname, lname, email, title, image1, image2, image3, image4, content } = req.body;

        const isdatastored = await Blog.create({ name: fname + " " + lname, email, photo: [image1, image2, image3, image4], text: content, title });
        if (!isdatastored) {
            console.log('Err');
            res.status(500).send('Error storing blog data');
        } else {
            console.log('Data stored successfully');
            res.redirect("/show-blogs");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating blog');
    }
});

app.get("/read-blog/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Blog.findById(id);
        console.log(item);
        res.render('read_blogs', { item });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error reading blog');
    }
});

app.post("/delete-blog/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteitem = await Blog.findByIdAndDelete(id);
        if (!deleteitem) {
            console.log('Item not deleted');
            res.status(500).send('Error deleting blog');
        } else {
            console.log('Item deleted');
            res.redirect("/show-blogs");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting blog');
    }
});

app.listen(port, () => { console.log('Server is running at port 3000'); });
