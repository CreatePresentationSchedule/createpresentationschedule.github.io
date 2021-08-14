`use strict`

// * VARS
let formSteps = Array.from(document.getElementsByClassName(`step`));
let nextButton = document.getElementById(`nextBtn`);
let previousButton = document.getElementById(`prevBtn`);
let navContainer = document.getElementById(`navContainer`);
let progress = document.getElementById(`navProgress`);
let stepCount = 0;

// * FUNCTIONS
showStep = (e) => { // ? this is to show each step
    e.style.display = 'block';
    setTimeout(function () { // ? this is needded otherwise the 'display: block;' will just show by itself
        e.style.opacity = 1;
    }, 1);
}

hideStep = (e) => { // ? this is to hide each step
    e.style.display = 'none';
    e.style.opacity = 0;
}

checkVisible = (count) => { // ? generic check during navigation for what the page should be doing
    checkShuffle(); // ! populate the confirmation table - this is a scuffed work-around
    for(let i = 0; i < formSteps.length; i++){ // ? for loop to go through the array of steps
        i == count ? showStep(formSteps[i]) : hideStep(formSteps[i]); // ? if the step is correct, show it... else, hide it
    }
    count == 0 ? previousButton.style.visibility = 'hidden' : previousButton.style.visibility = 'visible'; // ? hides the 'previous' button if you can't go back
    count+1 == formSteps.length ? nextButton.style.visibility = 'hidden' : nextButton.style.visibility = 'visible'; // ? hides the 'next' button if you can't go forwards
    stepCount = count; // ? update the step count
    progress.style.width = `${((count+1) / formSteps.length) * 100}%`; // ? change the width of the progress bar based on the step count
}

// * LISTENERS
nextButton.onclick = () => checkVisible(stepCount+=1);
previousButton.onclick = () => checkVisible(stepCount-=1);

// * RUNTIME
checkVisible(0);
