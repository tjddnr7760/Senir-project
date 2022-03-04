//require module prompt, data, web3, node-bluetooth, ethereumjs-tx, ethereumjs-wallet, fs
const prompt = require('prompt-sync')();
const data = require('./data.js');
const Web3 = require('web3');
const bluetooth = require('node-bluetooth');
const Transaction = require('ethereumjs-tx');
const etherwallet = require('ethereumjs-wallet');
const fs = require('fs');

/**** basic data ****/
//web3
const url = data.url;
const web3 = new Web3(url);
const abi = data.abi;
const contract = data.contract;
const blockchain = new web3.eth.Contract(abi, contract);
//account
let wallet = undefined;
let account = undefined;
let privatekey = undefined;


//output paired devices list
async function printPairedList(device) {
    //get tokenId(bluetooth device Id), tokenAdd(blockchain address who owns devices)
    let tokenId = prompt("Choose tokenId : ");
    let tokenAdd = prompt("Insert token address : ");

    //print paired devices list
    device.listPairedDevices(console.log);

    //smartcontract call ownerOf()
    let start = new Date();
    await blockchain.methods.ownerOf(Number(tokenId)).call()
        .then(result => {
            console.log("The owner is : "+ result);
        }).catch(err =>{
            console.log(err);
        })
    let end = new Date();
    console.log("ownerOf methods time : " + (end - start));

    //smartcontract call balanceOf()
    let start1 = new Date();
    await blockchain.methods.balanceOf(tokenAdd).call()
        .then(result => {
            console.log(tokenAdd + "'s device number : "+ result);
        }).catch(err =>{
            console.log(err);
        })
    let end1 = new Date();
    console.log("balanceOf methods time : " + (end1 - start1));

    // let start2 = new Date();
    // await blockchain.methods.addtoMac().call()
    //     .then(result => {
    //         console.log("Blockchain saved device(recent) : "+ result);
    //     }).catch(err =>{
    //         console.log(err);
    //     })
    // let end2 = new Date();
    // console.log("addtoMac methods time : " + (end2 - start2));
}


//search devices
async function searchDevices(device) {
    //serach devices and console
    await device
        .on('finished',  console.log.bind(console, 'finished'))
        .on('found', function found(address){
        console.log('Found: ' + address);
    }).scan();
}


//pairing and make NFT
async function pairNft() {
    //save mac address and select channel
    let add = prompt("Choose bluetooth device :");
    const password = prompt("Insert BlockChain password :");
    let channel = 4;

    let bname = add.substring(19);
    let macadd = add.substring(1, 18);
    console.log(bname);
    console.log(macadd);

    //make account or load privatekey
    let start2 = new Date();
    if(fs.existsSync("./privatekey.js")){
        let data = fs.readFileSync("privatekey.js", 'utf-8'); 
        const fromdata = JSON.parse(data);
        console.log(fromdata);
        const dad = etherwallet.fromV3(fromdata, password);
        privatekey = dad.getPrivateKey();
        account = "0x" + dad.getAddress().toString('hex');
        console.log(privatekey);
        console.log("public address : " + account)
    } else{
        const createaccount = web3.eth.accounts.create();
        console.log(createaccount);
        account = createaccount.address;
        privatekey = Buffer.from(createaccount.privateKey.substr(2), 'hex');
        console.log(account);
        console.log(privatekey);
        wallet = etherwallet.fromPrivateKey(Buffer.from(privatekey, "hex"));
        const data = JSON.stringify(wallet.toV3(password));
        fs.writeFileSync("privatekey.js", data);
        console.log("Charge Gas fee");
    }
    let end2 = new Date();
    let keytime = (end2 - start2);
    console.log("Get privateKey time : " + keytime);

    //make bluetooth connect to remote device
    let nfttime = 0;
    bluetooth.connect(add, channel, async function(err, connection){

        let start4 = new Date();
        await maketxObject(bname, macadd)
            .then(result => console.log(result))
            .catch(err => console.log(err));
        let end4 = new Date();
        nfttime = (end4 - start4);
        console.log("Making NFT time : " + nfttime);
        // //connect complete, writing data in bluetooth device
        // connection.write(new Buffer.from(paringnumber, 'utf-8'), () => {
        //     console.log("wrote");
        // });

        // //connect complete, listening data in bluetooth device
        // connection.on('data', (buffer) => {
        //     console.log('received message:', buffer.toString());
        // });
        
    })
   
    // console.log("Bluetooth pairing time : " + (keytime + nfttime));
}

//Transfer NFT
async function transferNft() {
    //input send address, send tokenid
    let sendadd = prompt("Choose send address : ");
    let sendtokenid = prompt("choose token address : ");
    let mmac = prompt("Insert device mac : ");
    // let bname = add.substring(19);
    // let mmac = add.substring(1, 18);
    // console.log(bname+ '  '+  mmac);

    //return account transaction count
    let start5 = new Date();
    await web3.eth.getTransactionCount(account, (err, txCount)=>{
        //Create object to communicate ethereum
        const txObject = {
            nonce : web3.utils.toHex(txCount),
            gasLimit : web3.utils.toHex(2100000),
            gasPrice : web3.utils.toHex(web3.utils.toWei('6', 'gwei')),
            to : contract,
            from : account,
            chainid : 3,
            data : blockchain.methods.transfer(sendadd, sendtokenid, mmac).encodeABI()
        }
        //send txObject print result
        sendSignedTx(txObject, (err, txHash)=>{
            console.log('err:', err, 'txHash:', txHash);
        });
    });
    let end5 = new Date();
    console.log("Transfer NFT time : " + (end5 - start5));
}


//signing process method
function sendSignedTx(transactionObject, cb) {
    const transaction = new Transaction(transactionObject);
    // sign a transaction
    transaction.sign(privatekey);
    // serialize the transaction
    const serializedEthTx = '0x' +transaction.serialize().toString("hex"); 
    // send signed transaction
    web3.eth.sendSignedTransaction(serializedEthTx, cb); 
}

//
function maketxObject(bname, macadd){
    return new Promise(function(resolve, reject){
        web3.eth.getTransactionCount(account)
        .then(txCount => {
            const txObject = {
                nonce : web3.utils.toHex(txCount),
                gasLimit : web3.utils.toHex(2100000),
                gasPrice : web3.utils.toHex(web3.utils.toWei('6', 'gwei')),
                to : contract,
                from : account,
                chainid : 3,
                data : blockchain.methods.createBluetooth(bname,macadd).encodeABI()
            }
            //send txObject print result
            sendSignedTx(txObject, (err, txHash)=>{
                resolve(txHash);
                // console.log('err:', err, 'txHash:', txHash);
            });
        }).catch(err =>{
            reject(err);
            // console.log(err);
        })
    })
}


module.exports = {
    printPairedList,
    searchDevices,
    pairNft,
    transferNft,
    sendSignedTx
}