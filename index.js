const express = require('express');
const users = require('./MOCK_DATA.json');
const fs = require('fs');
const { appendFile } = require('fs/promises');

const app = express();
const PORT = 8000;

//Middleware-Plugin
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: false }));


app.use((req, res, next) => {
    console.log("Hello from middleware 2");
    req.myUserName = "Deepak Verma";
    next();
})

app.use((req, res, next) => {
    console.log("Hello from middleware 3", req.myUserName);
    fs.appendFile(
        "log.txt",
        `\n${Date.now()}:${req.ip} ${req.method}: ${req.path}\n`,
        (err, data) => {
            next();
        }
    );

});


//routes
app.get('/users', (req, res) => {
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join('')}
    </ul>
    `;
    res.send(html);
});

//rest api

app.get('/api/users', (req, res) => {
    //custom headers -- Always add X to custom headers
    res.setHeader("X-MyName", "Deepak Verma");
    console.log("I am in get route", req.myUserName);
    return res.json(users);
})

// app.get('/api/users/:id', (req, res) => {
//     const id=Number(req.params.id);
//     const user =users.find((user) => user.id === id); 
//     return res.json(user);
// })

app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user);
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const userIndex = users.findIndex(user => user.id === id);

        if (userIndex === -1) {
            return res.status(404).send({ error: "User not found" });
        }

        // Update user with new values from req.body, ignoring undefined values
        for (const prop in req.body) {
            if (req.body[prop] !== undefined) {
                users[userIndex][prop] = req.body[prop];
            }
        }

        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send({ error: "Failed to update the user" });
            }
            res.send({ status: "success", user: users[userIndex] });
        });
    })
    .delete((req, res) => {
        const id = Number(req.params.id);
        const index = users.findIndex(user => user.id === id);

        if (index === -1) {
            return res.status(404).json({ status: "failed", message: "User not found" });
        }

        // Remove the user from the array
        users.splice(index, 1);

        // Write the updated users array back to the file
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error("Failed to write to file:", err);
                return res.status(500).json({ status: "error", message: "Failed to update users file" });
            }
            return res.json({ status: "success", message: "User deleted" });
        });
    })


app.post('/api/users', (req, res) => {
    const body = req.body;
    console.log("Body", body);
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.json({ status: "success", id: users.length });
    });


});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));