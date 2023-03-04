async function addPackageToDB() {
    
    //Get last package id
    const packageResponse = await fetch('/packageInfo', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    const packageInfoDB = await packageResponse.json();
    var packageID = packageInfoDB.length + 1;

    //Get sticker color and time sorted from fields
    var stickerColor = document.getElementById("stickerColor").value;
    var timeSorted = document.getElementById("timeSorted").value;
    
    //Create JSON object with info
    const newPackage = {
        packageid: parseInt(packageID),
        stickercolor: stickerColor,
        timesorted: timeSorted
    };
    
    
    const packagePostResponse = await fetch('/addPackage', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPackage)
    })


    document.getElementById("stickerColor").value = '';
    document.getElementById("timeSorted").value = '';
}


function searchFunction(x) {
    document.getElementById(x).focus();
}