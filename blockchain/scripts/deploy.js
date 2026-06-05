const hre = require("hardhat");

async function main() {
  const CertificateVerification = await hre.ethers.getContractFactory(
    "CertificateVerification"
  );

  const contract = await CertificateVerification.deploy();
  await contract.deployed();

  console.log("CertificateVerification deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
