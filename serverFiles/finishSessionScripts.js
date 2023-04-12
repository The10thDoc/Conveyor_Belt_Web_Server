async function completeSession() {
    //Count number of rows in PackageInfo table
    //For each row in PackageInfo:
    //  get color and add 1 to color counter for given color
    //  default case is error package and add 1 to error counter
    //  
    //  Get time value for first row and time value for last row

    //Create new SessionInfo row with all numbers gathered
    //Total sorted = num rows - num errors
    var timeStart;
    var timeEnd;
    var totalCount = 0;
    var errorCount = 0;
    var redCount = 0;
    var greenCount = 0;
    var blueCount = 0;

    //Getting color and error counts
    const colorGetResponse = await fetch('/colorCount', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    //Getting json response and placing in array
    const data = await colorGetResponse.json();

    //Setting variables for placing in finished session
    for(var i=0; i < data.length; i++) {
        //Checking sticker color count
        switch(String(data[i].stickercolor)) {
            case "RED":
                redCount = data[i].count;
                //totalCount = totalCount + redCount;
                break;
            case "GREEN":
                greenCount = data[i].count;
                //totalCount = totalCount + greenCount;
                break;
            case "BLUE":
                blueCount = data[i].count;
                //totalCount = totalCount + blueCount;
                break;
            default:
                errorCount = data[i].count;
        }
    }


    var totalCountedInt = Integer.ParseInt(redCount) + Integer.ParseInt(greenCount) + Integer.ParseInt(blueCount) + Integer.ParseInt(errorCount);
    //Getting total package count
    const packageCountGetResponse = await fetch('/packageCount', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    const data_package = await packageCountGetResponse.json();

    totalCount = data_package[0].count;

    //Getting start and end times from database
    const timeGetResponse = await fetch('/timeFrame', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    const data_time = await timeGetResponse.json();

    //Storing times in variables
    timeStart = data_time[0].min;
    timeEnd = data_time[0].max;

    //Creating object with obtained values:
    const newSession = {
        starttime:      timeStart,
        endtime:        timeEnd,
        totalSorted:    totalCountedInt,
        //totalsorted:    totalCount,
        numredsorted:   redCount,
        numgreensorted: greenCount,
        numbluesorted:  blueCount,
        numerrors:      errorCount
    }

    //Sending object to a new session
    const sessionPost = await fetch('/finishSession', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSession)
    });

    const packageTableResponse = await fetch('/updatepackageInfo', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    const sessionTableResponse = await fetch('/updateSessionInfo', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    alert("Success!  Session finished and package table cleared.")
}