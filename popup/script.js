function displayNote(){
    chrome.storage.local.get(["Count"]).then((result) => {
        if(result.Count == 0 || result.Count == undefined || result.Count == null){
            let span = document.createElement("span");
            span.innerHTML = "You have no notes";
            span.style.fontSize = "16px";
            document.getElementById("note-container").appendChild(span);
            chrome.storage.local.set({"Count": "0" }, function(){});
        }else if(result.Count > 0 && result.Count != undefined && result.Count != null){
            //load notes
        }
    });
}

function openEditor(){
    document.getElementById("editor-window").style.display = "flex";
}

function closeEditor(){
    document.getElementById("editor-window").style.display = "none";
}

function addNote(){

}

function deleteNote(){
    
}

window.onload = function() {
    displayNote();
}

document.getElementById("add-btn").addEventListener("click", function(){
    openEditor();
});

document.getElementById("exit-btn").addEventListener("click", function(){
    closeEditor();
});