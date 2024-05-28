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

document.getElementById("save-btn").addEventListener("click", function(){
    addNote();
    closeEditor();
});

document.getElementById("del-btn").addEventListener("click", function(){
    deleteNote();
    closeEditor();
});

function countLines() {
    const textarea = document.getElementById("textarea");
    const lineHeight = parseFloat(window.getComputedStyle(textarea).lineHeight);
    const totalHeight = textarea.scrollHeight;
    const rows = textarea.rows;
    
    if (lineHeight && lineHeight !== 180) {
        return Math.round(totalHeight / lineHeight);
    } else {
        return Math.round(totalHeight / rows);
    }
}

document.getElementById("textarea").addEventListener("input", function(){
    let chars = document.getElementById("textarea").value.replace(/[\r\n]+/g, "").length;
    document.getElementById("ch").innerHTML = chars;

    let lines = document.getElementById("textarea").value.split(/\r\n|\r|\n/).length;
    document.getElementById("ln").innerHTML = lines;
    console.log(lines);
});
