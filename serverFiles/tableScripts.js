//Displaying packageInfo table on website
async function createPackageSheet() {
    var packageid;
    var stickercolor;
    var timesorted;

    //Query packageInfo table
    const response = await fetch('/packageInfo', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        }
    });

    const data = await response.json();

    //Add each package to sheet
    var table = document.getElementById("package_sheet");

    for(var i=0; i < data.length; i++) {
        var tr = document.createElement('tr');

        packageid = data[i].packageid;
        stickercolor = data[i].stickercolor;
        timesorted = data[i].timesorted;

        rowText = ' \
        <td>' + packageid + '</td> \
        <td>' + stickercolor + '</td> \
        <td>' + timesorted + '</td>';

        tr.innerHTML = rowText;
        table.appendChild(tr);
    }
}

/*
async function refreshPackageSheet() {
    var packageid;
    var stickercolor;
    var timesorted;

    //Query packageInfo table
    const response = await fetch('/packageInfo', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        }
    });

    const data = await response.json();

    //Add each package to sheet
    var table = document.getElementById("package_sheet");

    for(var i=0; i < data.length; i++) {
        packageid = data[i].packageid;
        stickercolor = data[i].stickercolor;
        timesorted = data[i].timesorted;

        rowText = ' \
        <td>' + packageid + '</td> \
        <td>' + stickercolor + '</td> \
        <td>' + timesorted + '</td>';

        tr.innerHTML = rowText;
        table.appendChild(tr);
    }

}
*/


//Displaying sessionInfo table on website
async function createSessionSheet() {
    var sessionid;
    var starttime;
    var endtime;
    var totalsorted;
    var numredsorted;
    var numgreensorted;
    var numbluesorted;
    var numerrors;

    //Query packageInfo table
    const response = await fetch('/sessionInfo', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json'
        }
    });

    const data = await response.json();

    //Add each package to sheet
    var table = document.getElementById("session_sheet");

    for(var i=0; i < data.length; i++) {
        var tr = document.createElement('tr');

        sessionid = data[i].sessionid;
        starttime = data[i].starttime;
        endtime = data[i].endtime;
        totalsorted = data[i].totalsorted;
        numredsorted = data[i].numredsorted;
        numgreensorted = data[i].numgreensorted;
        numbluesorted = data[i].numbluesorted;
        numerrors = data[i].numerrors;

        rowText = ' \
        <td>' + sessionid + '</td> \
        <td>' + starttime + '</td> \
        <td>' + endtime + '</td> \
        <td>' + totalsorted + '</td> \
        <td>' + numredsorted + '</td> \
        <td>' + numgreensorted + '</td> \
        <td>' + numbluesorted + '</td> \
        <td>' + numerrors + '</td>';

        tr.innerHTML = rowText;
        table.appendChild(tr);
    }
}