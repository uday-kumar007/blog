const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 5000;

const DATA_FILE = path.join(__dirname, "data.json");


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


// ===============================
// DATA FUNCTIONS
// ===============================

function readData() {

    try {

        const data = fs.readFileSync(
            DATA_FILE,
            "utf8"
        );

        return JSON.parse(data);

    } catch (error) {

        return {
            users: [],
            blogs: []
        };

    }
}


function writeData(data) {

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(data, null, 2)
    );

}


// ===============================
// TEST API
// ===============================

app.get("/api", (req, res) => {

    res.json({
        success: true,
        message: "Uday's Blog API is working"
    });

});


// ===============================
// REGISTER API
// ===============================

app.post("/api/register", (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;


    if (!name || !email || !password) {

        return res.status(400).json({

            success: false,

            message: "All fields are required"

        });

    }


    const data = readData();


    const existingUser =
        data.users.find(
            user => user.email === email
        );


    if (existingUser) {

        return res.status(400).json({

            success: false,

            message: "Email already registered"

        });

    }


    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        password: password

    };


    data.users.push(newUser);

    writeData(data);


    res.status(201).json({

        success: true,

        message: "Registration successful",

        user: {

            id: newUser.id,

            name: newUser.name,

            email: newUser.email

        }

    });

});


// ===============================
// LOGIN API
// ===============================

app.post("/api/login", (req, res) => {

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({

            success: false,

            message: "Email and password are required"

        });

    }


    const data = readData();


    const user =
        data.users.find(
            user =>
                user.email === email &&
                user.password === password
        );


    if (!user) {

        return res.status(401).json({

            success: false,

            message: "Invalid email or password"

        });

    }


    res.json({

        success: true,

        message: "Login successful",

        user: {

            id: user.id,

            name: user.name,

            email: user.email

        }

    });

});


// ===============================
// CREATE BLOG API
// ===============================

app.post("/api/blogs", (req, res) => {

    const {
        title,
        category,
        content,
        authorId,
        authorName
    } = req.body;


    if (!title || !category || !content) {

        return res.status(400).json({

            success: false,

            message:
                "Title, category and content are required"

        });

    }


    const data = readData();


    const newBlog = {

        id: Date.now(),

        title: title,

        category: category,

        content: content,

        authorId: authorId || null,

        authorName: authorName || "Anonymous",

        createdAt: new Date().toISOString()

    };


    data.blogs.push(newBlog);

    writeData(data);


    res.status(201).json({

        success: true,

        message: "Blog created successfully",

        blog: newBlog

    });

});


// ===============================
// GET ALL BLOGS API
// ===============================

app.get("/api/blogs", (req, res) => {

    const data = readData();


    res.json({

        success: true,

        blogs: data.blogs

    });

});


// ===============================
// GET SINGLE BLOG API
// ===============================

app.get("/api/blogs/:id", (req, res) => {

    const data = readData();


    const blog =
        data.blogs.find(
            blog =>
                blog.id == req.params.id
        );


    if (!blog) {

        return res.status(404).json({

            success: false,

            message: "Blog not found"

        });

    }


    res.json({

        success: true,

        blog: blog

    });

});


// ===============================
// SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});