`use strict`

// * VARS
let ElDownloadButton = document.getElementById(`downloadBtn`);

// * FUNCTIONS
save = () => {
    // * this block of code is from the bootstrap website
    let toastElList = [].slice.call(document.querySelectorAll('.toast'));
    let toastList = toastElList.map(function(toastEl) {
        return new bootstrap.Toast(toastEl) // ? only use the default options
    });
    
    toastList.forEach(toast => toast.show()); // ? use the bootstrap show function

    // TODO: Write some code to save a table as a CSV... it shouldn't be too complex

    // // ? from isherwood on Stack Overflow https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
    let csvContent = "data:text/csv;charset=utf-8," 
        + outputArray.map(e => e.join(",")).join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "presentation_schedule.csv");
    document.body.appendChild(link); // Required for FF

    link.click();

}

// * LISTENERS
ElDownloadButton.onclick = () => save();
