const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  patchContact,
} = require("../../controllers/control-contacts");

router.get("/", getAllContacts);

router.get("/:contactId", getContactById);

router.post("/", createContact);

router.delete("/:contactId", deleteContact);

router.patch("/:contactId", patchContact);

module.exports = router;
