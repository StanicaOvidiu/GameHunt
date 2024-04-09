import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(readFileSync("GENERATE PRIVATE KEY ADMIN"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const adminUserData = {
  username: "Solomon",
  email: "solomon31@yahoo.com",
  password: "123456@A",
  role: "Admin",
};

let adminUid;

admin
  .auth()
  .createUser({
    email: adminUserData.email,
    password: adminUserData.password,
    username: adminUserData.username,
    disabled: false,
  })
  .then((userRecord) => {
    console.log("Successfully created new admin user:", userRecord.uid);

    adminUid = userRecord.uid;

    return admin.auth().setCustomUserClaims(adminUid, { admin: true });
  })
  .then(() => {
    console.log("User is now an admin");

    const db = admin.firestore();

    return db.collection("users").doc(adminUid).set(adminUserData);
  })
  .then(() => {
    console.log("Admin information stored in Firestore");
  })
  .catch((error) => {
    console.log("Error:", error);
  });
