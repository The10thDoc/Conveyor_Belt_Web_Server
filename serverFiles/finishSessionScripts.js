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
    var redCount;
    var greenCount;
    var blueCount;

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
            case "red":
                redCount = data[i].count;
                totalCount = totalCount + 1;
                break;
            case "green":
                greenCount = data[i].count;
                totalCount = totalCount + 1;
                break;
            case "blue":
                blueCount = data[i].count;
                totalCount = totalCount + 1;
                break;
            default:
                errorCount = errorCount + 1;
        }
    }

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
        totalsorted:    totalCount,
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

    alert("Success!  Session finished and package table cleared.")
}