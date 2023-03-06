//Functions used in addPackage.html
//Adding package with POST
async function addPackageToDB() {
    //Get sticker color and time sorted from fields
    var stickerColor = document.getElementById("stickerColor").value;
    var timeSorted = document.getElementById("timeSorted").value;
    
    //Create JSON object with info
    const newPackage = {
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

    const packageTableResponse = await fetch('/updatepackageInfo', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    document.getElementById("stickerColor").value = '';
    document.getElementById("timeSorted").value = '';
}


function searchFunction(x) {
    document.getElementById(x).focus();
}