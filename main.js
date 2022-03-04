//해야할일 :컨트랙트 조회기능 수정, 성능측정 시간측정, 페어링 nft만드는과저에서 순서, 실제 데이터 찾는 부분
//페어링시 매개변수 넘겨주는 부분 ㅇ, key로직 짜주기 ㅇ, 파일 모듈별로 나누기 ㅇ, 컨트랙트 함수 검증(리믹스) ㅇ, 설치모듈 정리, 함수 비동기 실행시 딜레이현상 ㅇ

//require module prompt, bluetooth
const prompt = require('prompt-sync')();
const bluetooth = require('node-bluetooth');

//require file function
const f = require('./function.js');

//bluetooth device object
let device = new bluetooth.DeviceINQ();

/**** logic start ****/
console.log("Select Number");
load();

async function load(){
    //scan number, device name list array, device mac address list array
    let num;

    console.log("1.Paired List");
    console.log("2.Search bluetooth devices");
    console.log("3.Pairing");
    console.log("4.Transfer NFT");
    console.log("0.Exit");
    
    do {
        //scan num
        num = prompt("Choose execution : ");
        //choose num 1, output paired devices list
        if(num == 1){
            await f.printPairedList(device);
        //choose num 2, search devices
        } else if(num == 2){
            await f.searchDevices(device);
        //choose num 3, pairing and make NFT
        } else if(num == 3) {
            await f.pairNft();
            await sleep(15000);
        //choose num 4, Transfer NFT
        } else if(num == 4){
            await f.transferNft();
            await sleep(10000);
        }

    device = new bluetooth.DeviceINQ();
    //choose num 0 exit
    } while(num != 0);
}

function sleep(t){
    return new Promise(resolve=>setTimeout(resolve,t));
}