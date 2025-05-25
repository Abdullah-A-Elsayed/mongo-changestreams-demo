const { connectToDatabase, client } = require("../db");

async function watchInventoryChanges() {
  const db = await connectToDatabase();
  const inventory = db.collection("inventory");

  try {
    const changeStream = inventory.watch([], {
      fullDocument: "required",
      fullDocumentBeforeChange: "required",
    });
    console.log("🔍 Watching for inventory changes...");

    // Handle errors
    changeStream.on("error", (error) => {
      console.error("Error in change stream:", error);
    });

    // Handle when the change stream closes
    changeStream.on("close", () => {
      console.log("Change stream closed");
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      console.log("\nClosing change stream and database connection...");
      await changeStream.close();
      await client.close();
      process.exit(0);
    });

    while (true) {
      const change = await changeStream.next();
      console.log("Change detected:", change);
    }
  } catch (error) {
    console.error("Error setting up change stream:", error);
    await client.close();
  }
}

watchInventoryChanges();

// db.runCommand({collMod: 'inventory', changeStreamPreAndPostImages: {enabled: true}})
