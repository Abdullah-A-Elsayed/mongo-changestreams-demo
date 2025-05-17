function sendItemStockEmail(item) {
  console.log("\n📦 Item back in stock!");
  console.log(`📧 Sending email notification to customers:`);
  console.log("----------------------------------------");
  console.log(`Subject: ${item.name} is back in stock!`);
  console.log(`Dear Valued Customer,\n`);
  console.log(
    `Great news! ${item.name} is now back in stock with ${item.count} units available.`
  );
  console.log(`Price: $${item.price}`);
  console.log(`\nHurry and place your order while supplies last!`);
  console.log("----------------------------------------\n");
}
module.exports = { sendItemStockEmail };
