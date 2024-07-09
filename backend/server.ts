import express from "express";
import cors from "cors";
import client from "./client";
import sgMail from "@sendgrid/mail";
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/sendEmail", (req, res) => {
  console.log(process.env.SENDGRID_API_KEY);
  console.log(req.body.usersToBlast);

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  for (const user of req.body.usersToBlast) {
    const msg = {
      to: user.userEmail, // Change to your recipient
      from: req.body.fromEmail, // Change to your verified sender
      subject: req.body.subject,
      text: "Hi " + user.userName + ",\n\n" + req.body.message,
    };

    sgMail
      .send(msg)
      .then((response) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  res.send(JSON.stringify({ message: "Email sent!" }));
});

app.get("/getAllLists", async (req, res) => {
  const lists = await client.list.findMany({
    include: {
      users: true,
    },
  });
  res.send(lists);
});

app.get("/getList/:listId", async (req, res) => {
  const list = await client.list.findUnique({
    where: {
      id: req.params.listId,
    },
  });
  res.send(list);
});

app.get("/getAllUsers", async (req, res) => {
  const users = await client.user.findMany();
  res.send(users);
});

app.get("/getUserListRelations", async (req, res) => {
  const userListRelations = await client.userInList.findMany();
  res.send(userListRelations);
});

//create a list - find all the users in selected Users and link them to a new list name listname
app.post("/createList", async (req, res) => {
  const list = await client.list.create({
    data: {
      name: req.body.listName,
    },
  });

  const updatedlist = await client.userInList.createMany({
    data: req.body.selectedUsers.map(
      (user: { id: string; name: string; email: string }) => ({
        userId: user.id,
        listId: list.id,
        userName: user.name,
        userEmail: user.email,
      })
    ),
  });

  res.send(list);
});

app.post("/deleteList", async (req, res) => {
  await client.userInList.deleteMany({
    where: {
      listId: req.body.listId,
    },
  });

  const list = await client.list.delete({
    where: {
      id: req.body.listId,
    },
  });
  res.send(list);
});

app.post("/deleteUserFromList", async (req, res) => {
  const user = await client.userInList.delete({
    where: {
      userId_listId: {
        userId: req.body.userId,
        listId: req.body.listId,
      },
    },
  });
  res.send(user);
});

app.post("/addUserToList", async (req, res) => {
  const user = await client.userInList.create({
    data: {
      userId: req.body.userId,
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      listId: req.body.listId,
    },
  });
  res.send(user);
});

app.post("/createUser", async (req, res) => {
  const user = await client.user.create({
    data: {
      name: req.body.userName,
      email: req.body.userEmail,
    },
  });

  await client.userInList.createMany({
    data: req.body.lists.map((list: { id: string; name: string }) => ({
      userId: user.id,
      listId: list.id,
      userName: user.name,
      userEmail: user.email,
    })),
  });

  res.send(user);
});

app.post("/deleteUsers", async (req, res) => {
  const userToDelete = req.body.users;

  for (const user of userToDelete) {
    await client.userInList.deleteMany({
      where: {
        userId: user.id,
      },
    });
  }

  for (const user of userToDelete) {
    await client.user.delete({
      where: {
        id: user.id,
      },
    });
  }

  res.send(userToDelete);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
