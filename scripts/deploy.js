async function main() {
  const accounts = await hre.ethers.getSigners();
  const deployerAddress = accounts[0].address;
  console.log("address of the deployer ", deployerAddress);

  const Acc = await hre.ethers.getContractFactory("AccessControlContract");
  const acc = await Acc.deploy({
    gasLimit: 8000000
  });
  await acc.waitForDeployment(); // Wait for deployment
  console.log("Acc deployed to:", acc.target);

  const Logs = await hre.ethers.getContractFactory("LogsContract");
  const logs = await Logs.deploy();
  await logs.waitForDeployment(); // Wait for deployment
  console.log("Logs deployed to:", logs.target);

  const Prc = await hre.ethers.getContractFactory("PatientRecordsContract");
  const prc = await Prc.deploy(logs.target, acc.target);
  await prc.waitForDeployment(); // Wait for deployment
  console.log("Prc deployed to:", prc.target);

  const Srhc = await hre.ethers.getContractFactory("StewardRelationshipHistoryContract");
  const srhc = await Srhc.deploy(prc.target);
  await srhc.waitForDeployment(); // Wait for deployment
  console.log("Srhc deployed to:", srhc.target);

  const Base = await hre.ethers.getContractFactory("base");
  const base = await Base.deploy(srhc.target, prc.target,logs.target);
  await base.waitForDeployment(); // Wait for deployment
  console.log("Base deployed to:", base.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
