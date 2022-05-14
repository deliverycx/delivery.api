var db = connect("mongodb://admin:540193@mongodb:27017/admin");

db = db.getSiblingDB('deliverycx'); // we can not use "use" statement here to switch db

db.createUser(
    {
        user: "admin",
        pwd: "540193",
        roles: [ { role: "readWrite", db: "deliverycx"} ],
        passwordDigestor: "server",
    }
)