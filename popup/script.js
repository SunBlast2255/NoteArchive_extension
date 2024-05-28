function displayNote(){
    chrome.storage.local.get(["Count"]).then((result) => {
        if(result.Count == 0 || result.Count == undefined || result.Count == null){
            document.getElementById("note-container").innerHTML = "";
            document.getElementById("notes").innerHTML = "0";

            let span = document.createElement("span");
            span.innerHTML = "You have no notes";
            span.style = "margin: 5px; font-size: 16px;"
            document.getElementById("note-container").appendChild(span);

            chrome.storage.local.set({"Count": "0" }, function(){});
        }else if(result.Count > 0 && result.Count != undefined && result.Count != null){
            document.getElementById("note-container").innerHTML = "";

            let count;
            chrome.storage.local.get("Count", function(result) {
                count = result.Count;
                document.getElementById("notes").innerHTML = count;

                getAllNotes(function(notes) {
                        for (let noteId in notes) {
                            if (notes.hasOwnProperty(noteId) && noteId !== "Count") {
                                console.log('Note ID:', noteId, 'Text:', notes[noteId]);

                                let div = document.createElement("div");
                                div.style = "display: flex; width: 100px; height: 100px; border: 1px solid black; border-radius: 5px; text-overflow: ellipsis; overflow: hidden; cursor: pointer; margin-top: 5px;";
                                let span = document.createElement("span");
                                span.innerHTML = notes[noteId];
                                div.appendChild(span);
                                document.getElementById("note-container").appendChild(div);
                            }
                        }
                });
                
            });
        }
    });
}

function getAllNotes(callback){
    chrome.storage.local.get(null, function(result) {
        callback(result);
    });
}

function openEditor(){
    document.getElementById("editor-window").style.display = "flex";
}

function closeEditor(){
    document.getElementById("textarea").value = "";
    document.getElementById("ch").innerHTML = "0";
    document.getElementById("ln").innerHTML = "1";
    document.getElementById("editor-window").style.display = "none";
}

function addNote(){
    let date = new Date();

    let text = document.getElementById("textarea").value;
    let noteId = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;

    let note = {};
    note[noteId] = text;

    chrome.storage.local.set(note, function(){
        chrome.storage.local.get("Count", function(result) {
            let count = parseInt(result.Count) + 1;
            chrome.storage.local.set({"Count": count}, function(){
                displayNote();
            });
        });
    });
}

function editNote(){

}

function ViewNote(){

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

document.getElementById("textarea").addEventListener("input", function(){
    let chars = document.getElementById("textarea").value.replace(/[\r\n]+/g, "").length;
    document.getElementById("ch").innerHTML = chars;

    let lines = document.getElementById("textarea").value.split(/\r\n|\r|\n/).length;
    document.getElementById("ln").innerHTML = lines;
});
