/* ============================================
   DEVBLOG APPLICATION
============================================ */


/* ============================================
   STORAGE
============================================ */

function getUsers() {

    const users =
        localStorage.getItem("devblog_users");

    return users
        ? JSON.parse(users)
        : [];
}


function saveUsers(users) {

    localStorage.setItem(
        "devblog_users",
        JSON.stringify(users)
    );
}


function getBlogs() {

    const blogs =
        localStorage.getItem("devblog_blogs");

    return blogs
        ? JSON.parse(blogs)
        : [];
}


function saveBlogs(blogs) {

    localStorage.setItem(
        "devblog_blogs",
        JSON.stringify(blogs)
    );
}


function getCurrentUser() {

    const user =
        localStorage.getItem(
            "devblog_current_user"
        );

    return user
        ? JSON.parse(user)
        : null;
}


function saveCurrentUser(user) {

    localStorage.setItem(
        "devblog_current_user",
        JSON.stringify(user)
    );
}


function logout() {

    localStorage.removeItem(
        "devblog_current_user"
    );

}


/* ============================================
   SECURITY
============================================ */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* ============================================
   REGISTER
============================================ */

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "registerName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "registerEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;


            if (name.length < 2) {

                alert(
                    "Please enter a valid name."
                );

                return;
            }


            if (password.length < 6) {

                alert(
                    "Password must contain at least 6 characters."
                );

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                alert(
                    "Passwords do not match."
                );

                return;
            }


            const users =
                getUsers();


            const existingUser =
                users.find(
                    function (user) {

                        return (
                            user.email ===
                            email
                        );

                    }
                );


            if (existingUser) {

                alert(
                    "This email is already registered."
                );

                return;
            }


            const newUser = {

                id: Date.now(),

                name: name,

                email: email,

                password: password

            };


            users.push(newUser);

            saveUsers(users);


            alert(
                "Registration successful!"
            );


            window.location.href =
                "login.html";

        }
    );
}


/* ============================================
   LOGIN
============================================ */

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            const users =
                getUsers();


            const user =
                users.find(
                    function (item) {

                        return (
                            item.email ===
                            email &&
                            item.password ===
                            password
                        );

                    }
                );


            if (!user) {

                alert(
                    "Invalid email or password."
                );

                return;
            }


            saveCurrentUser(user);


            alert(
                "Login successful!"
            );


            window.location.href =
                "dashboard.html";

        }
    );
}


/* ============================================
   PAGE PROTECTION
============================================ */

function checkAuthentication() {

    const page =
        window.location.pathname
            .split("/")
            .pop();


    const protectedPages = [

        "dashboard.html",

        "create-blog.html"

    ];


    if (
        protectedPages.includes(page)
    ) {

        const user =
            getCurrentUser();


        if (!user) {

            alert(
                "Please login first."
            );


            window.location.href =
                "login.html";

        }

    }

}


checkAuthentication();


/* ============================================
   LOGOUT
============================================ */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            logout();

            window.location.href =
                "index.html";

        }
    );

}


/* ============================================
   CREATE BLOG
============================================ */

const blogForm =
    document.getElementById(
        "blogForm"
    );


if (blogForm) {

    blogForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const user =
                getCurrentUser();


            if (!user) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;
            }


            const title =
                document
                    .getElementById(
                        "blogTitle"
                    )
                    .value
                    .trim();


            const category =
                document
                    .getElementById(
                        "blogCategory"
                    )
                    .value;


            const content =
                document
                    .getElementById(
                        "blogContent"
                    )
                    .value
                    .trim();


            if (title.length < 5) {

                alert(
                    "Blog title must contain at least 5 characters."
                );

                return;
            }


            if (!category) {

                alert(
                    "Please select a category."
                );

                return;
            }


            if (content.length < 20) {

                alert(
                    "Blog content must contain at least 20 characters."
                );

                return;
            }


            const newBlog = {

                id: Date.now(),

                title: title,

                category: category,

                content: content,

                authorId: user.id,

                authorName: user.name,

                date:
                    new Date().toLocaleDateString(
                        "en-IN"
                    )

            };


            const blogs =
                getBlogs();


            blogs.unshift(newBlog);


            saveBlogs(blogs);


            alert(
                "Blog published successfully!"
            );


            window.location.href =
                "dashboard.html";

        }
    );
}


/* ============================================
   HOME PAGE
============================================ */

function loadHomeBlogs() {

    const container =
        document.getElementById(
            "homeBlogs"
        );


    if (!container) {
        return;
    }


    const blogs =
        getBlogs();


    container.innerHTML = "";


    if (blogs.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No blogs yet
                </h3>

                <p>
                    Be the first person to publish a blog.
                </p>

                <a
                    href="register.html"
                    class="btn primary-btn">

                    Create Account

                </a>

            </div>

        `;

        return;
    }


    blogs.forEach(
        function (blog) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "blog-card";


            card.innerHTML = `

                <span class="blog-category">

                    ${escapeHTML(
                        blog.category
                    )}

                </span>


                <h3>

                    ${escapeHTML(
                        blog.title
                    )}

                </h3>


                <p>

                    ${escapeHTML(
                        blog.content
                    )}

                </p>


                <div class="blog-date">

                    By
                    ${escapeHTML(
                        blog.authorName
                    )}

                    ·

                    ${escapeHTML(
                        blog.date
                    )}

                </div>

            `;


            container.appendChild(card);

        }
    );

}


loadHomeBlogs();


/* ============================================
   DASHBOARD
============================================ */

function loadDashboard() {

    const container =
        document.getElementById(
            "dashboardBlogs"
        );


    if (!container) {
        return;
    }


    const user =
        getCurrentUser();


    if (!user) {
        return;
    }


    /* Welcome message */

    const welcomeMessage =
        document.getElementById(
            "welcomeMessage"
        );


    if (welcomeMessage) {

        welcomeMessage.textContent =
            "Welcome, " +
            user.name;

    }


    /* All blogs */

    const blogs =
        getBlogs();


    /* Only current user's blogs */

    const myBlogs =
        blogs.filter(
            function (blog) {

                return (
                    blog.authorId ===
                    user.id
                );

            }
        );


    /* Blog count */

    const totalBlogs =
        document.getElementById(
            "totalBlogs"
        );


    if (totalBlogs) {

        totalBlogs.textContent =
            myBlogs.length;

    }


    container.innerHTML = "";


    /* Empty */

    if (myBlogs.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    You have no blogs yet.
                </h3>

                <p>
                    Start sharing your knowledge.
                </p>

                <a
                    href="create-blog.html"
                    class="btn primary-btn">

                    Create Your First Blog

                </a>

            </div>

        `;

        return;
    }


    /* Display blogs */

    myBlogs.forEach(
        function (blog) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "blog-card";


            card.innerHTML = `

                <span class="blog-category">

                    ${escapeHTML(
                        blog.category
                    )}

                </span>


                <h3>

                    ${escapeHTML(
                        blog.title
                    )}

                </h3>


                <p>

                    ${escapeHTML(
                        blog.content
                    )}

                </p>


                <div class="blog-date">

                    Published:
                    ${escapeHTML(
                        blog.date
                    )}

                </div>


                <button
                    class="delete-btn"
                    data-id="${blog.id}">

                    Delete Blog

                </button>

            `;


            container.appendChild(card);

        }
    );


    /* Delete buttons */

    const deleteButtons =
        container.querySelectorAll(
            ".delete-btn"
        );


    deleteButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    deleteBlog(id);

                }
            );

        }
    );

}


function deleteBlog(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this blog?"
        );


    if (!confirmation) {
        return;
    }


    let blogs =
        getBlogs();


    blogs =
        blogs.filter(
            function (blog) {

                return blog.id !== id;

            }
        );


    saveBlogs(blogs);


    alert(
        "Blog deleted successfully!"
    );


    loadDashboard();

}


loadDashboard();