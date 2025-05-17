const { connectToDatabase, client } = require("../db");
const { sendItemStockEmail } = require("../services/send-item-stock-email");

async function watchInventoryChanges() {
  const db = await connectToDatabase();
  const inventory = db.collection("inventory");

  try {
    const changeStream = inventory.watch([], {
      fullDocument: "required",
      fullDocumentBeforeChange: "required",
    });
    console.log("🔍 Watching for inventory changes...");

    changeStream.on("change", async (change) => {
      if (
        change.updateDescription?.updatedFields.count &&
        change.fullDocumentBeforeChange?.count === 0
      ) {
        const item = change.fullDocument;

        sendItemStockEmail(item);
      } else {
        console.log("Change discared!");
      }
    });

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
  } catch (error) {
    console.error("Error setting up change stream:", error);
    await client.close();
  }
}

watchInventoryChanges();
