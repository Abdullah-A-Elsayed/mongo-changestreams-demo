const { connectToDatabase, client } = require("../db");
const { sendItemStockEmail } = require("../services/send-item-stock-email");

async function watchInventoryChanges() {
  const db = await connectToDatabase();
  const inventory = db.collection("inventory");

  try {
    const changeStream = inventory.watch(
      [
        {
          $match: {
            operationType: "update",
            "updateDescription.updatedFields.count": { $exists: true },
            "updateDescription.updatedFields.count": { $gt: 0 },
            "fullDocumentBeforeChange.count": { $eq: 0 },
          },
        },
      ],
      {
        fullDocument: "required",
        fullDocumentBeforeChange: "required",
      }
    );
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
      const item = change.fullDocument;

      sendItemStockEmail(item);
    }
  } catch (error) {
    console.error("Error setting up change stream:", error);
    await client.close();
  }
}

watchInventoryChanges();
