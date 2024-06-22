const Web3 = require('web3');

async function getNetworkId() {
  const web3 = new Web3('http://127.0.0.1:8545');
  const networkId = await web3.eth.net.getId();
  console.log(`Network ID: ${networkId}`);
}

getNetworkId().catch(console.error);
