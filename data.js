const abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"mac","type":"string"}],"name":"NewBluetooth","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":false,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"_balance","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"bluetoothes","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"mac","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_mac","type":"string"}],"name":"createBluetooth","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"_owner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"string","name":"_mac","type":"string"}],"name":"transfer","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const url = 'https://ropsten.infura.io/v3/3a6976d45c854fd0b29c60a4f60cf58c';
const contract = '0xdF72E4d3cD8E71C2CC9872cdc148362DbDfe6273';

// const account = '0x35c2064CEf5206b59a6e8813917cCe38307cB248';
// const privatekey = Buffer.from('3271eb1ac3584df253a325c7b87a2977e7617d27f1510fea36f71818e76363e5', 'hex',);

module.exports = {
    abi,
    url,
    contract
}