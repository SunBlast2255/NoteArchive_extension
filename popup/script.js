let editingMode = false;
let editID = "";

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
                                let div = document.createElement("div");
                                div.setAttribute("class", "note");
                                div.setAttribute("id", noteId);

                                let span = document.createElement("span");
                                span.innerHTML = notes[noteId];
                                div.appendChild(span);

                                let icons = document.createElement("div");
                                icons.setAttribute("class", "icon-block flex center");
                                div.appendChild(icons);

                                let delIcon = document.createElement("img");
                                delIcon.src = "../images/delete.png";
                                delIcon.setAttribute("class", "icon-small delete");
                                delIcon.title = "Delete";
                                icons.appendChild(delIcon);

                                let editIcon = document.createElement("img");
                                editIcon.src = "../images/edit.png";
                                editIcon.setAttribute("class", "icon-small edit");
                                editIcon.title = "Edit";
                                icons.appendChild(editIcon);

                                let viewIcon = document.createElement("img");
                                viewIcon.src = "../images/view.png";
                                viewIcon.setAttribute("class", "icon-small view");
                                viewIcon.title = "View";
                                icons.appendChild(viewIcon);

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

function openEditor(id){

    document.getElementById("editor-window").style.display = "flex";
    
    if(id){
        chrome.storage.local.get(id, function(result) {
            document.getElementById("textarea").value = result[id];

            let chars = document.getElementById("textarea").value.replace(/[\r\n]+/g, "").length;
            document.getElementById("ch").innerHTML = chars;
        
            let lines = document.getElementById("textarea").value.split(/\r\n|\r|\n/).length;
            document.getElementById("ln").innerHTML = lines;
        });
    }else{
        document.getElementById("textarea").value = "";
    }
}

function closeEditor(){
    document.getElementById("textarea").value = "";
    document.getElementById("ch").innerHTML = "0";
    document.getElementById("ln").innerHTML = "1";
    document.getElementById("editor-window").style.display = "none";

    editID = "";
    editingMode = false;
}

function addNote(){

    if(editingMode == false){
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
    }else if(editingMode == true){

        let text = document.getElementById("textarea").value;
        let noteId = editID;

        let note = {};
        note[noteId] = text;

        chrome.storage.local.set(note, function(){
            displayNote();
            editID = "";
            editingMode = false;
        });
    }
}

function editNote(id){
    editingMode = true;
    editID = id;
    openEditor(id);
}

function openViewer(id){
    document.getElementById("viewer-window").style.display = "flex";
    chrome.storage.local.get(id, function(result) {
        document.getElementById("textarea-readonly").value = result[id];

        let chars = document.getElementById("textarea-readonly").value.replace(/[\r\n]+/g, "").length;
        document.getElementById("ch-total").innerHTML = chars;
    
    
        let lines = document.getElementById("textarea-readonly").value.split(/\r\n|\r|\n/).length;
        document.getElementById("ln-total").innerHTML = lines;
    });
}

function closeViewer(){
    document.getElementById("viewer-window").style.display = "none";
    document.getElementById("textarea-readonly").value = "";

    document.getElementById("ch-total").innerHTML = "0";
    document.getElementById("ln-total").innerHTML = "0";
}

function deleteNote(id){
    chrome.storage.local.remove(id, function(){
        chrome.storage.local.get("Count", function(result) {
            let count = result.Count - 1;
            chrome.storage.local.set({"Count": count}, function(){
                displayNote();
            });
        });
    });
}

window.onload = function() {
    displayNote();
}

document.getElementById("add-btn").addEventListener("click", function(){
    openEditor();
});

document.getElementById("exit-editor-btn").addEventListener("click", function(){
    closeEditor();
});

document.getElementById("exit-viewer-btn").addEventListener("click", function(){
    closeViewer();
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

document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains("delete")) {
        let id = event.target.parentNode.parentNode.id;
        deleteNote(id);
    }else if(event.target.classList.contains("view")){
        let id = event.target.parentNode.parentNode.id;
        openViewer(id);
    }else if(event.target.classList.contains("edit")){
        let id = event.target.parentNode.parentNode.id;
        editNote(id);
    }
});

//Yeah, yeah, I know. The code is a little lame, but I'll fix it later. The important thing is that it works.