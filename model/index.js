const fsx = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "./contacts.json");
console.log(contactsPath);
const contactList = fsx.readFileSync(contactsPath, "utf-8");
const contactsItems = JSON.parse(contactList);

const listContacts = async () => {
  console.log("List of contacts: ");
  console.table(contactsItems);

  return contactsItems;
};

const getContactById = async (contactId) => {
  const foundContact = await contactsItems.find((contact) => {
    if (contact.id === contactId) {
      console.log(`Get contact by ID=${contactId}:`);
      console.table(contact);
      return contact;
    }
  });
  if (!foundContact) {
    console.log("error");
  }

  return foundContact;
};

const removeContact = async (contactId) => {
  const newContacts = await contactsItems.filter(
    (contact) => contact.id !== contactId
  );
  if (newContacts.length === contactsItems.length) {
    console.log("error");
    return contactsItems;
  }

  console.log("Contact deleted successfully! New list of contacts: ");
  console.table(newContacts);

  fsx.writeFile(contactsPath, JSON.stringify(newContacts), (error) => {
    if (error) {
      return console.log("error :", error);
    }
  });

  return newContacts;
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  contacts.push({
    id: contactsItems.length + 1,
    name: name,
    email: email,
    phone: phone,
  });
  console.log("Contacts added successfully! New lists of contacts: ");
  console.table(contactsItems);

  fsx.writeFile(contactsPath, JSON.stringify(contactsItems), (error) => {
    if (error) {
      return console.log(error);
    }
  });

  return contactsItems;
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  const contact = await contactsItems.find((contact) => {
    if (contact.id === contactId) {
      contact.name = name;
      contact.email = email;
      contact.phone = phone;
      console.log(`Contact with ID ${contactId} updated!`);
      console.table(contactsItems);
      return contact;
    }
  });

  if (contact == null) {
    console.log("error");
    return;
  }

  fsx.writeFile(contactsPath, JSON.stringify(contactsItems), (error) => {
    if (error) {
      return console.log(error);
    }
  });

  return contactsItems;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
