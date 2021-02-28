const router = require("express").Router();
const fs = require("fs").promises;
const functionContacts = require("../../model/index.js");

const contacts = JSON.parse(
  fs.readFileSync("./model/contacts.json", { encoding: "utf-8" })
);

router.get("/", async (req, res, next) => {
  const contactList = await functionContacts.listContacts();
  res.status(200).json(contactList);
});

router.get("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;

  const foundContact = await functionContacts.getContactById(Number(contactId));

  if (!foundContact) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json({ foundContact });
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "missing required name field" });
  }

  const updateContact = functionContacts.addContact(name, email, phone);

  res.status(201).json(updateContact);
});

router.delete("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;

  const newContacts = await functionContacts.removeContact(Number(contactId));

  if (newContacts.length === contacts.length) {
    return res.status(400).json({ message: "Not found" });
  }

  res.status(200).json({
    message: `Contact with ID=${contactId} deleted successfully!`,
  });
});

router.patch("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "missing required name field" });
  }

  const updatedContacts = functionContacts.updateContact(
    Number(contactId),
    name,
    email,
    phone
  );

  if (!updatedContacts) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json(updatedContacts);
});

module.exports = router;
