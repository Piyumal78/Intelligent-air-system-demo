const { db } = require("./config/firebase-config");

async function test() {
  console.log("DB keys:", Object.keys(db));
  try {
    const docRef = db.collection("devices").doc("TEST_NODE");
    await docRef.set({ test: true, createdAt: new Date().toISOString() });
    console.log("Successfully wrote to Firestore");
  } catch (err) {
    console.error("Failed to write:", err);
  }
}

test();
