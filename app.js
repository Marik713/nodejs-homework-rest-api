const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const contactsRouter = require("./routes/api/contactsRouter");
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.send("DataBase of Contacts");
});

app.use("/api", contactsRouter);

// app.use('*', (req, res) => {
//     res.status(404).json({
//         get_contacts: 'http://localhost:3000/api/contacts',
//         create_contacts: 'http://localhost:3000/api/contacts',
//         find_contact: 'http://localhost:3000/api/contacts/:contactId',
//         delete_contacts: 'http://localhost:3000/api/contacts/:contactId',
//         update_contacts: 'http://localhost:3000/api/contacts/:contactId',
//     });
// });

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/contacts",
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

module.exports = app;
