`use strict`

// * VARS
let outputArray = []; // this is out here so we can grab it from our save function

let ElTimeStart = document.getElementById(`timeStart`);

let ElTimeEnd = document.getElementById(`timeEnd`);

let ElPresLength = document.getElementById(`timeGap`);

let ElBeforeSwitch = document.getElementById(`beforeLunchSwitch`);
let ElTimeBeforeLunchBreak = document.getElementById(`timeBeforeLunchBreak`);
let ElLengthBeforeLunchBreak = document.getElementById(`lengthBeforeLunchBreak`);

let ElTimeLunch = document.getElementById(`timeLunch`);

let ElAfterSwitch = document.getElementById(`afterLunchSwitch`);
let ElTimeAfterLunchBreak = document.getElementById(`timeAfterLunchBreak`);
let ElLengthAfterLunchBreak = document.getElementById(`lengthAfterLunchBreak`);

let ElNames = document.getElementById(`names`);

let ElConfirmNames = document.getElementById(`confirmNames`);
let ElShuffle = document.getElementById(`shuffleSwitch`);

let ElNumberTrainers = document.getElementById(`numberTrainer`);

let ElOutputTable = document.getElementById(`outputTable`);

// * FUNCTIONS
getNames = () => {return ElNames.value.split(/\r?\n/)} // ? gets the value from the names element and turns it into an array

splitArray = (array, n) => { // method from Senthe on Stack Overflow - https://stackoverflow.com/questions/8188548/splitting-a-js-array-into-n-arrays
    let res = [];
    for(let i = n; i > 0 ; i--) {
        res.push(array.splice(0, Math.ceil(array.length / i)))
    }
    return res;
}

toMinutes = (e) => {
    let h = e.value.split(`:`)[0];
    let m = e.value.split(`:`)[1];
    return (parseInt(h,10)*60)+parseInt(m,10);
}

toTimeString = (mins) => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    h = h < 10 ? `0${h}` : h;
    m = m < 10 ? `0${m}` : m;
    return `${h}:${m}`;
}

timeArray = () => {
    let times = []; // array for times

    let start = toMinutes(ElTimeStart);
    let end = toMinutes(ElTimeEnd);
    let presLen = parseInt(ElPresLength.value, 10);

    for(let i = start; i <= end; i+=presLen){
        if(!ElTimeBeforeLunchBreak.disabled && i >= toMinutes(ElTimeBeforeLunchBreak) && i < (toMinutes(ElTimeBeforeLunchBreak) + parseInt(ElLengthBeforeLunchBreak.value,10))){ // ? before lunch break
            times.push([toMinutes(ElTimeBeforeLunchBreak),`BREAK`]);
        } else if(i >= toMinutes(ElTimeLunch) && i < (toMinutes(ElTimeLunch) + 60)){ // ? lunch time
            times.push([toMinutes(ElTimeLunch),`LUNCH`]);
        } else if(!ElTimeAfterLunchBreak.disabled && i >= toMinutes(ElTimeAfterLunchBreak) && i < (toMinutes(ElTimeAfterLunchBreak) + parseInt(ElLengthAfterLunchBreak.value,10))){ // ? after lunch break
            times.push([toMinutes(ElTimeAfterLunchBreak),`BREAK`]);
        } else { // ? just the time
            times.push([i,``]);
        }
    }
    // ? add the end of the day
    times.push([end,`END OF DAY`]);
    
    let uniques = [];
    let duplicates = {};
    times.forEach(e => {
        let stringified = JSON.stringify(e);
        if(!duplicates[stringified]) {
            uniques.push(e);
            duplicates[stringified] = true;
        }
    });
    
    uniques.forEach( e => {
        e[0] = toTimeString(e[0]);
    });

    return uniques;
}

outputTable = (array) => { // ? this is for the table that can be saved

    array = splitArray(array, ElNumberTrainers.value); // ? split the names up into chunks based on no. of trainers

    // ------------------------------------------------------------------------------------------------------------------------

    // ! initial setup of output array
    outputArray = timeArray();
    let step = 0;
    outputArray.forEach( (e, i) => {
        if(e[1]==`` && array[0][step] != undefined){
            e[1] = array[0][step];
            step++;
        }
    });
    // trainer number loop
    for(let i = 1; i < ElNumberTrainers.value; i++){
        step = 0;
        outputArray.push([`-----`,`-----`]);
        timeArray().forEach( (e) => {
            if(e[1]==`` && array[i][step] != undefined){
                outputArray.push([e[0],array[i][step]]);
                step++;
            } else { 
                outputArray.push(e);
            }
        });
        console.log(array[i]);
    }

    // ------------------------------------------------------------------------------------------------------------------------

    // write to DOM
    ElOutputTable.innerHTML = `<tr>
                                 <th>Time</th>
                                 <th>Name</th>
                               </tr>`;

    outputArray.forEach( (e) => {
        let row = document.createElement('tr');
        row.innerHTML = `<td>${e[0]}</td><td>${e[1]}</td>`;
        ElOutputTable.appendChild(row);
    });
    
}

confirmTable = (array) => { // ! This is also called by checkShuffle() inside of checkVisible() in navScript.js which is maybe a little hacky but it works

    ElConfirmNames.innerHTML = `<tr>
                                  <th>#</th>
                                  <th>Name</th>
                                </tr>`;

    array.forEach( (e, i) => {
        let row = document.createElement('tr');
        row.innerHTML = `<td>${i+1}</td><td>${e}</td>`;
        confirmNames.appendChild(row);
    });

    // ? at the end of the confirm build it builds the output table
    outputTable(array);
}

// ? Fisher-Yates shuffle ( from https://bost.ocks.org/mike/shuffle/ )
shuffle = (array) => {
    let m = array.length, t, i;
    
    // While there remain elements to shuffle…
    while (m) {
    
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
    
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

checkShuffle = () => {ElShuffle.checked ?  confirmTable(shuffle(getNames())) : confirmTable(getNames())} // ? if the shuffle toggle is on then shuffle table, else revert to the regular table

// * LISTENERS

ElShuffle.onclick = () => checkShuffle(); // ? toggle to shuffle list of names

// TODO: make this DRY (probably with a parent then an n-th child or something)

ElBeforeSwitch.onclick = () => { // ? toggle for interactivity based on if break is scheduled or not
    ElTimeBeforeLunchBreak.disabled = !ElTimeBeforeLunchBreak.disabled;
    ElLengthBeforeLunchBreak.disabled = !ElLengthBeforeLunchBreak.disabled;
}

ElAfterSwitch.onclick = () => { // ? toggle for interactivity based on if break is scheduled or not
    ElTimeAfterLunchBreak.disabled = !ElTimeAfterLunchBreak.disabled;
    ElLengthAfterLunchBreak.disabled = !ElLengthAfterLunchBreak.disabled;
}
