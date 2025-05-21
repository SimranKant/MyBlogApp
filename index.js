const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

const port = 8080;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname,"public")));

let blogs = [
    {
        id: uuidv4(),
        username: "simran",
        title: "How to code",
        content: "Coding is a skill that requires practice, patience, and problem-solving. Start with understanding the basics of programming logic, such as loops, conditionals, and variables. Use beginner-friendly languages like Python or JavaScript, and build small projects to solidify your understanding. Don’t hesitate to ask questions or read documentation. Over time, you’ll improve and feel confident tackling more complex problems.",
    },
    {
        id: uuidv4(),
        username: "arjun",
        title: "JavaScript Basics",
        content: "JavaScript is one of the core technologies of the web. It allows you to create dynamic and interactive experiences for users. Learn about variables, data types, functions, and event handling. As you progress, explore concepts like closures, promises, and async/await. Practice by building things like to-do apps or calculators. JavaScript is essential for front-end development and widely used in back-end too via Node.js.",
    },
    {
        id: uuidv4(),
        username: "priya",
        title: "Learning Python",
        content: "Python is an excellent programming language for beginners due to its simple syntax. It’s widely used in web development, data science, machine learning, and automation. Start by learning variables, loops, and functions. Use libraries like pandas and matplotlib if you're interested in data. Build scripts that solve real-world problems, such as file management or web scraping, to strengthen your skills.",
    },
    {
        id: uuidv4(),
        username: "rahul",
        title: "React for Beginners",
        content: "React is a JavaScript library developed by Facebook for building user interfaces. It uses a component-based architecture, making code reusable and manageable. Learn JSX, props, and state to begin with. Understanding how React handles the virtual DOM and rendering will help you build efficient apps. Projects like weather apps or blogs are great for applying your knowledge.",
    },
    {
        id: uuidv4(),
        username: "neha",
        title: "Node.js Introduction",
        content: "Node.js is a runtime environment that allows JavaScript to run on the server. It's built on Chrome’s V8 engine and supports asynchronous, event-driven programming. Learn about modules, file system handling, and creating basic HTTP servers. Express.js, a framework built on Node, simplifies routing and middleware. With Node.js, you can build full-stack applications using only JavaScript.",
    },
    {
        id: uuidv4(),
        username: "amit",
        title: "CSS Flexbox Guide",
        content: "Flexbox is a powerful CSS layout module that allows you to design responsive layout structures without using float or positioning. With Flexbox, you can align items horizontally or vertically, control spacing, and create complex layouts with ease. Learn how `justify-content`, `align-items`, and `flex-wrap` work. Try building a responsive navbar or a card layout to practice.",
    },
    {
        id: uuidv4(),
        username: "isha",
        title: "HTML5 Features",
        content: "HTML5 introduced a host of new elements and APIs that make web development more semantic and functional. Tags like `<article>`, `<section>`, `<header>`, and `<footer>` help structure your content meaningfully. HTML5 also includes support for audio, video, and canvas elements, allowing for multimedia and interactive graphics without external plugins.",
    },
    {
        id: uuidv4(),
        username: "vikas",
        title: "Debugging Tips",
        content: "Debugging is an essential part of the development process. Start by reading error messages carefully—they often point directly to the issue. Use `console.log()` to trace the flow of your code and examine variable values. Most modern browsers have powerful developer tools to inspect elements, monitor network activity, and step through JavaScript code. Understanding how to isolate bugs and fix them efficiently will make you a better developer.",
    },
    {
        id: uuidv4(),
        username: "ananya",
        title: "Deploying with Vercel",
        content: "Vercel is a platform that simplifies the deployment of frontend projects. It offers seamless integration with GitHub, GitLab, and Bitbucket. Push your code, and Vercel builds and deploys your app automatically. It's especially optimized for frameworks like Next.js. Vercel also handles custom domains, serverless functions, and performance analytics, making it a great choice for modern web projects.",
    },
    {
        id: uuidv4(),
        username: "ravi",
        title: "Understanding Git",
        content: "Git is a distributed version control system that helps track changes in your codebase. It allows multiple developers to collaborate on a project efficiently. Start by learning the basic commands like `git init`, `add`, `commit`, `push`, and `pull`. Understand how branches work to manage different versions of your project. GitHub, GitLab, and Bitbucket are popular platforms for hosting your repositories and working with others on open-source or personal projects.",
    }
];

// Index route
app.get("/blog",(req,res)=>{
    res.render("index.ejs",{blogs});
});

// Create Route
app.get("/blog/new",(req,res)=>{
    res.render("new.ejs");
});

app.get("/blog/search", (req, res) => {
    const { q } = req.query;  // get the search query from URL ?q=...

    // If no query or empty, redirect to all blogs or show all
    if (!q || q.trim() === "") {
        return res.redirect("/blog");
    }

    // Filter blogs where title, username, or content includes the search query (case insensitive)
    const filteredBlogs = blogs.filter(blog => {
        const lowerQ = q.toLowerCase();
        return (
            blog.title.toLowerCase().includes(lowerQ) ||
            blog.username.toLowerCase().includes(lowerQ) ||
            blog.content.toLowerCase().includes(lowerQ)
        );
    });
    
    // Render index.ejs but with filtered blogs
    res.render("index.ejs", { blogs: filteredBlogs });
});

app.post("/blog",(req,res)=>{
    let {username,title,content}=req.body;
    let id = uuidv4();
    blogs.push({id,username,title,content});
    res.redirect("/blog");
});


// Show Route

app.get("/blog/:id",(req,res)=>{
    let {id}=req.params;
    console.log(id);
    let blog = blogs.find((p)=>id===p.id);
    res.render("show.ejs",{blog});
});

// Update Route

app.get("/blog/:id/edit",(req,res)=>{
    let {id}=req.params;
    let blog = blogs.find((p)=>p.id===id);
    res.render("edit.ejs",{blog});
});

app.patch("/blog/:id",(req,res)=>{
    let {id}=req.params;
    let newContent = req.body.content;
    let blog = blogs.find((p)=>p.id===id);
    blog.content=newContent;
    res.redirect("/blog");
});


// Delete Route
app.delete("/blog/:id",(req,res)=>{
    let {id}=req.params;
    blogs = blogs.filter((p)=>p.id!=id);
    res.redirect("/blog");
});

//search route



app.listen(port,()=>{
    console.log(`App is listening to port ${port}`);
});