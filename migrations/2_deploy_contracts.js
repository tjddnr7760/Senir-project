const Bluetooth = artifacts.require("./Bluetooth.sol");

module.exports = function (deployer) {
  deployer.deploy(Bluetooth);
};
