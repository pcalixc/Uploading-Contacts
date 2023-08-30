window.addEventListener('DOMContentLoaded', start);

function start() {
    loadContacts();
    allContactsView();
    renderContacts();
}

let contactsArray;
let allContacts;
const fileTempl = document.getElementById("file-template"),
empty = document.getElementById("empty");
let selectedFile = {};
const gallery = document.getElementById("gallery"),
overlay = document.getElementById("overlay");
const hidden = document.getElementById("hidden-input");
let counter = 0;
let successCounter= true;



document.getElementById("allContacts").onclick = () =>{
    renderContacts();
    document.getElementById("allContactsView").classList.remove('hidden');
    }

const loadContacts= async () => {
    try {
      const response = await fetch('https://8j5baasof2.execute-api.us-west-2.amazonaws.com/production/tests/trucode/items', {
          method: "get"
      });
      if (!response.ok) {
          throw new Error(`Error loading contacts. Status code: ${response.status}`);
      }
      allContacts = await response.json();
  } catch (error) {
      console.error("An error occurred:", error);
  }
    }

const formatPhone= (number) => {
      const paddedNumber = number.padEnd(10, '0');
      number= `${paddedNumber.slice(0, 3)}-${paddedNumber.slice(3, 6)}-${paddedNumber.slice(6, 10)}`
      return number ;
}

const sendContacts = async (contactArray)=> {
  try {
    const apiUrl = "https://8j5baasof2.execute-api.us-west-2.amazonaws.com/production/tests/trucode/items";
    let n= contactArray.length - 1;
    if (contactArray[n].endsWith("\n")) {
      contactArray[n] = contactArray[n].replace(/\n$/, "");
  }
    for (let i = 0; i < contactArray.length; i += 3) {
        document.getElementById('submitContacts').innerHTML='Uploading...';
        const name = contactArray[i];
        const phone = contactArray[i + 1];
        const email = contactArray[i + 2];
        const contactData = {
            name: name,
            phone: formatPhone(phone),
            email: email
        };
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        });
        const info = await response.json();

        if(info.message !='item stored'){
          successCounter= false
        }
        console.log("Sending", info); 
    }
    document.getElementById('submitContacts').innerHTML='Upload';
    renderContacts();

    if(successCounter== true){
      successMessage();
      remove();
      document.getElementById("contactNotif").classList.remove('hidden');
      renderContacts();
    }
    else{errorMessage('Oh, something went wrong')}

} catch (error) {
    console.error("Error:", error);
}};

const remove = () => {
  while (gallery.children.length > 0) {
    gallery.lastChild.remove();
  }
  selectedFile = {};
  empty.classList.remove("hidden");
  gallery.append(empty);
  };


function addFile(target, file) {
  console.log("from add file",file.type)
   if (file.type=='text/csv') {
      const reader = new FileReader(); 
      reader.onload = function(event) {
        const fileContents = event.target.result;
        contactsArray = fileContents.split(/,|\n(?!$)/)
      };
      reader.readAsText(file);
    
    objectURL = URL.createObjectURL(file);
    const clone = fileTempl.content.cloneNode(true);
    clone.querySelector("h1").textContent = file.name;
    clone.querySelector("li").id = objectURL;
    clone.querySelector(".size").textContent =
      file.size > 1024
      ? file.size > 1048576
        ? Math.round(file.size / 1048576) + "mb"
        : Math.round(file.size / 1024) + "kb"
      : file.size + "b";

    empty.classList.add("hidden");
    target.prepend(clone);
    selectedFile[objectURL] = file;
  }
  else{
    remove();
    errorMessage('Ups, that was not an .csv file');
  }
}

document.getElementById("button").onclick = () => hidden.click();
hidden.onchange = (e) => {
  selectedFile = e.target.files[0];
  console.log(selectedFile)
  addFile(gallery, selectedFile);
};

const successMessage = ()=>{
  var div = document.createElement("div");
  div.innerHTML =  			
    `<div class="flex h-screen w-screen flex-col items-center justify-center space-y-6 bg-gray-100 bg-opacity-50 shadow-md px-4 sm:flex-row sm:space-x-6 sm:space-y-0">
      <div class=" bg-white w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mt-8 h-16 w-16 text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <h1 class="mt-2 text-center text-2xl font-bold text-gray-500">Success</h1>
        <p class="my-4 text-center text-sm text-gray-500">Woah, all contacts were uploaded!</p>
      </div>
    </div>`

    div.style.position = "absolute";
    div.style.top = "50%";
    div.style.left = "50%";
    div.style.transform = "translate(-50%, -50%)";

    setTimeout(function() {
      div.remove();
    }, 2000);
    document.body.appendChild(div);
}

const errorMessage = (message)=>{
  var div = document.createElement("div");
  div.innerHTML =  			
  `<div class=" flex h-screen w-screen flex-col items-center justify-center space-y-6 bg-gray-100 bg-opacity-50 shadow-md px-4 sm:flex-row sm:space-x-6 sm:space-y-0">
    <div class="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:shadow-xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mt-8 h-16 w-16 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <h1 class="mt-2 text-center text-2xl font-bold text-gray-500">Error</h1>
        <p id="errortext" class="my-4 text-center text-sm text-gray-500"></p>
      </div>
    </div>`
  div.style.position = "absolute";
  div.style.top = "50%";
  div.style.left = "50%";
  div.style.transform = "translate(-50%, -50%)";
  setTimeout(function() {
    div.remove();
  }, 3000);

  document.body.appendChild(div);
  document.getElementById('errortext').innerHTML = `${message}`
}

submitContacts.addEventListener('click', () => {
  sendContacts(contactsArray)
});

// use to check if a file is being dragged
const hasFiles = ({ dataTransfer: { types = [] } }) =>
types.indexOf("Files") > -1;

function dropHandler(ev) {
  ev.preventDefault();
  const file = ev.dataTransfer.files[0]; // Obtener el primer archivo del arreglo
  if (file) {
    addFile(gallery, file);
  }
  overlay.classList.remove("draggedover");
  counter = 0;
}

function dragEnterHandler(e) {
e.preventDefault();
if (!hasFiles(e)) {
  return;
}
++counter && overlay.classList.add("draggedover");
}

function dragLeaveHandler(e) {
1 > --counter && overlay.classList.remove("draggedover");
}

function dragOverHandler(e) {
if (hasFiles(e)) {
  e.preventDefault();
}}



const allContactsView= ()=>{
var div = document.createElement("div");
div.id = "allContactsView"
div.className= "hidden "
  div.innerHTML =  			
  `<div class="  h-screen w-screen flex flex-col items-center justify-center space-y-6 bg-gray-100 bg-opacity-50 shadow-md">
  <div class="container w-full md:w-4/5 xl:w-3/5  px-2 transition-all duration-500">
      <!--Card-->
      <div class="p-8 mt-6 lg:mt-0 rounded shadow bg-white">
          <table id='contactsTable' class="stripe hover " style="width:100%; padding-top: 1em;  padding-bottom: 1em;">
              <thead>
                  <tr>
                  <th class="text-left">Nº</th>
                      <th class="text-left">Name</th>
                      <th class="text-left">Phone</th>
                      <th class="text-left">Email</th>
                  </tr>
              </thead>
              <tbody id=contactRow>
                 
              </tbody>
          </table>
          <button id="closeContactsView" onclick='closeContactsView()' class="inline-block px-2 py-2 text-base border-2 border-red-500 text-red-500 font-medium ml-auto
						leading-tight rounded-md hover:bg-red-500 hover:text-white focus:outline-none focus:ring-0 transition duration-150 ease-in-out mt-3">
							Close
						</button>
      </div>
  </div>
  </div>`
div.style.position = "absolute";
div.style.top = "50%";
div.style.left = "50%";
div.style.transform = "translate(-50%, -50%)";
document.body.appendChild(div);

}

const renderContacts=() =>{
    if (allContacts.items.length == 0){
      document.getElementById('contactsTable').innerHTML = `No contacts added`
    }
    else{ 
    document.getElementById('contactRow').innerHTML = ``
    let count=1;
    allContacts.items.forEach(e => {
    document.getElementById('contactRow').innerHTML += ` 
    <tr>
    <td>${count}</td>
    <td>${e.name}</td>
    <td>${e.phone}</td>
    <td>${e.email}</td>         
    </tr>`   
    count++ 
    }); 
  }
}

const closeContactsView=()=>{
    document.getElementById("allContactsView").classList.add('hidden');
    document.getElementById("contactNotif").classList.add('hidden');

}
