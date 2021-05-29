const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const app = express();
app.use(express.json());
const path = require("path");

let db;

async function func() {
  try {
    db = await open({
      filename: path.join(__dirname, "Person.db"),
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Started");
    });
  } catch (e) {
    console.log(e);
  }
}

func();

app.get("/allUsers", async (request, response) => {
  const { param = "" } = request.query;
  if (param !== "") {
    const a = param.split(",");
    const query = `select * from person where coordinate between ${a[0]} and ${a[1]} order by createdAt;`;
    response.send(await db.all(query));
  } else {
    const query = `select * from person order by createdAt;`;
    response.send(await db.all(query));
  }
});

app.post("/allUsers", async (request, response) => {
  const {
    name,
    mobile,
    email,
    street,
    locality,
    city,
    state,
    pincode,
    coordinateType,
    coordinate,
  } = request.body;
  const query = `insert into person (name,mobile,email,street,locality,city,state,pincode,coordinateType,coordinate) values ('${name}',
    '${mobile}',
    '${email}',
    '${street}',
    '${locality}',
    '${city}',
    '${state}',
    '${pincode}',
    '${coordinateType}',
    ${coordinate});`;
  try {
    await db.run(query);
    response.send("New User Created");
  } catch (e) {
    response.send(e.message);
  }
});

app.put("/allUsers", async (request, response) => {
  const { name = "", mobile, email = "" } = request.body;
  const data = `select * from person where mobile='${mobile}'`;
  const res = await db.get(data);
  if (res === undefined) {
    response.send("User not found");
  } else {
    const query = `update person set name='${name}',email='${email}' where mobile='${mobile}';`;
    await db.run(query);
    response.send("data Updated");
  }
});

app.delete("/allUsers", async (request, response) => {
  const { mobile } = request.body;
  const data = `select * from person where mobile='${mobile}'`;
  const res = await db.get(data);
  if (res === undefined) {
    response.send("User not found");
  } else {
    const query = `delete from person where mobile='${mobile}';`;
    await db.run(query);
    response.send("user deleted");
  }
});
