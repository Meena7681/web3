const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  const privatepass = process.env.PRIVATE_KEY_PASSWORD;
  console.log("privatekey:", privateKey);
  console.log("privatepass:-", privatepass);

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const encryptedJsonKey = await wallet.encrypt(privatepass);
  console.log(encryptedJsonKey);
  fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
