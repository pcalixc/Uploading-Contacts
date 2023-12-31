window.addEventListener('DOMContentLoaded', start);

function start() {
    loadContacts();
    allContactsView();
}

let contactsArray= []; // Stores contacts
let storedContacts;    // Variable for storing retrieved contacts
let counter = 0;
let success= true;
let hasFiles1= false
let uploadedCount=0;
let selectedFile = {};

const empty = document.getElementById("empty");
const  gallery = document.getElementById("gallery");
const overlay = document.getElementById("overlay");
const hidden = document.getElementById("hidden-input");



document.getElementById("storedContacts").onclick = () =>{
    renderContacts();
    document.getElementById("allContactsView").classList.remove('hidden');
    }


//Renders the contacts in the table based on the storedContacts data.
const renderContacts=() =>{
  if (storedContacts.items.length === 0){
    document.getElementById('container').classList.add('h-[180px]')
    document.getElementById('contactRow').innerHTML = `No contacts added`
    }
  else{ 
    document.getElementById('contactRow').innerHTML = ``
    let count=1;
    storedContacts.items.forEach(e => {
    document.getElementById('contactRow').innerHTML += ` 
      <tr class="whitespace-nowrap">
        <td class="px-6 py-2 text-sm text-center text-gray-500">
          ${count}
        </td>
        <td class="px-6 py-2 text-center">
          <div class="text-xs text-gray-900">
            ${e.name}
          </div>
        </td>
        <td class="px-6 py-2 text-center">
          <div class="text-xs text-gray-500">
            ${e.phone}
          </div>
        </td>
          <td class="px-6 py-2 text-center">
            <a href="#"
              class="px-4 py-1 text-xs text-green-600 bg-green-200 rounded-full"> ${e.email}</a>
          </td>
      </tr>`   
      count++ 
      }); 
    }
  };


//Retrieves contacts data from API endpoint and stores it in the storedContacts variable.
const loadContacts= async () => {
    try {
      const response = await fetch('https://8j5baasof2.execute-api.us-west-2.amazonaws.com/production/tests/trucode/items', {
          method: "GET"
      });
      if (!response.ok) {
          throw new Error(`Error loading contacts. Status code: ${response.status}`);
      }
      storedContacts = await response.json();
      console.log(storedContacts)
  } catch (error) {
      console.error("An error occurred:", error);
  }
    }


//Formats a phone number into the ###-###-#### format.
const formatPhone= (number) => {
      const paddedNumber = number.padEnd(10, '0');
      const formattedNumber = `${paddedNumber.slice(0, 3)}-${paddedNumber.slice(3, 6)}-${paddedNumber.slice(6, 10)}`
      return formattedNumber ;
}

// UploadS contacts to API
const uploadContacts = async (contactArray)=> {
  if(contactArray.length==0){
    errorMessage("You have to upload a document first")
  } else{   
    try {
      const apiUrl = "https://8j5baasof2.execute-api.us-west-2.amazonaws.com/production/tests/trucode/items";
      let n= contactArray.length - 1;

      //Remove newline character from the last element if present
      if (contactArray[n].endsWith("\n")) {
        contactArray[n] = contactArray[n].replace(/\n$/, "");
      }

      // Update the UI to indicate uploading
      document.getElementById('submitContacts').innerHTML=
          `Uploading... 
          <img class=" motion-safe:animate-spin h-4 w-4 opacity-50 " src="./img/loading-spinner-svgrepo-com.svg"></img> `

      for (let i = 0; i < contactArray.length; i += 3) {
        const name = contactArray[i];
        const phone = contactArray[i + 1];
        const email = contactArray[i + 2];
        const contactData = {
            name: name,
            phone: formatPhone(phone),
            email: email
        };

        // Send contactData via POST request
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        });
        const info = await response.json();

        if(info.message !='item stored'){
          success= false
        }
        console.log("Sending", info); 
        uploadedCount ++;
      }

      // Reset UI after upload
      document.getElementById('submitContacts').innerHTML='Upload';
      loadContacts();

      // Show success message and reset UI if success
      if(success== true){
        successMessage(uploadedCount, (contactArray.length/3));
        remove();
        document.getElementById("contactNotif").classList.remove('hidden');
      }
      else{errorMessage('Oh, something went wrong')}

        } 
      catch (error) {
      console.error("Error:", error);
    }}
};

//Displays an error message on the screen.
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
    </div>`;

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

/**
 * Displays a success message on the screen.
 * m - The number of successfully uploaded contacts.
 * n - The total number of contacts.
 */
const successMessage = (m,n)=>{
  var div = document.createElement("div");
  div.innerHTML =  			
    `<div class="flex h-screen w-screen flex-col items-center justify-center space-y-6 bg-gray-100 bg-opacity-50 shadow-md px-4 sm:flex-row sm:space-x-6 sm:space-y-0">
      <div class=" bg-white w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md duration-300 hover:scale-105 hover:shadow-xl">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mt-8 h-16 w-16 text-green-400" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <h1 class="mt-2 text-center text-2xl font-bold text-gray-500">Success</h1>
        <p class="my-4 text-center text-sm text-gray-500">Woah, you've uploaded ${m} of ${n} contacts!</p>
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

//Clears the gallery and resets related variables.
const remove = () => {
  while (gallery.children.length > 0) {
    gallery.lastChild.remove();
  }
  selectedFile = {};
  empty.classList.remove("hidden");
  gallery.append(empty);
  hasFiles1=false;
  contactsArray=[];
  };

//Adds a file to the gallery and processes its contents.
const addFile=(target, file)=> {
   if (file.type=='text/csv') {    
      const reader = new FileReader(); 
      reader.onload = function(event) {
        const fileContents = event.target.result;

        if(fileContents.trim()===''){
          errorMessage('Your .csv file is empty');
          remove();
          }
        contactsArray = fileContents.split(/,|\n(?!$)/)
      };
      reader.readAsText(file);
      document.getElementById("gallery").innerHTML=
      `
        <li class=" block p-1 w-full h-12">
          <article tabindex="0" class="group w-full h-full rounded-lg focus:outline-none focus:shadow-outline elative cursor-pointer relative ">
            <section class="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3">
              <h1 id="fileName" class="flex-1 group-hover:text-slate-500 mr-4 rounded-md border-0 text-sm font-light text-gray-500 h-2 pb-4">${file.name}</h1>
              <div class="flex">
                <p id="fileSize" class=" size text-xs text-blue-500">${fileSize(file.size)}</p>
              </div>
            </section>
          </article>
        </li>
  `
  }
  else{
    remove();
    errorMessage('Ups, that was not an .csv file');
  }
}

const fileSize = (size) => {
  if (size > 1048576) {
    return (Math.round(size / 1048576) + "mb");
  } else if (size > 1024) {
    return (Math.round(size / 1024) + "kb");
  } else {
    return (size + "b");
  }
};

document.getElementById("browseButton").onclick = () => hidden.click();

hidden.onchange = (e) => {
  if (hasFiles1){
    errorMessage("One at at time");
  }
  else{
    hasFiles1=true;
    selectedFile = e.target.files[0];
    if (selectedFile) {
      addFile(gallery, selectedFile);
    }
  }
};

submitContacts.addEventListener('click', () => {
  uploadContacts(contactsArray)
});

// use to check if a file is being dragged
const hasFiles2 = 
({ dataTransfer: { types = [] } }) =>
types.indexOf("Files") > -1;


const dropHandler=(ev)=>{
  ev.preventDefault();
  if (hasFiles1){
    errorMessage("One at at time");
  }else{
    hasFiles1=true;
    const file = ev.dataTransfer.files[0]; // Obtener el primer archivo del arreglo
    if (file) {
      addFile(gallery, file);
    }
  }
  overlay.classList.remove("draggedover");
  counter = 0;
}

const dragEnterHandler=(e)=> {
  e.preventDefault();
  if (!hasFiles2(e)) {
    return;
  }
  ++counter && overlay.classList.add("draggedover");
}

const dragLeaveHandler=(e)=> {
1 > --counter && overlay.classList.remove("draggedover");
}

const dragOverHandler=(e)=> {
if (hasFiles2(e)) {
  e.preventDefault();
}}

const allContactsView= ()=>{
var div = document.createElement("div");
div.id = "allContactsView"
div.className= "hidden h-5/6 w-5/6"
  div.innerHTML =  			
  `<div id="container" class="container flex justify-center mx-auto">
  <div class="flex flex-col ">
          <div class="pt-0 px-3 pb-3 mt-8 border-b bg-white border-gray-200 rounded-lg shadow h-min-[70%] h-[70%] w-max-[60%] overflow-y-auto">
              <table  class=" divide-y divide-gray-100" id="dataTable">
                  <thead class="bg-white sticky top-0">
                      <tr>
                          <th class="px-6 py-2 text-xs text-gray-500">
                          Nº
                          </th>
                          <th class="px-6 py-2 text-xs text-gray-500">
                              Name
                          </th>
                          <th class="px-6 py-2 text-xs text-gray-500">
                              Phone
                          </th>
                          <th class="px-6 py-2 text-xs text-gray-500">
                              Email
                          </th>
                      </tr>
                  </thead>
                  <tbody id=contactRow class="bg-white divide-y divide-gray-500">

                  </tbody>
              </table>
              <button id="closeContactsView" onclick='closeContactsView()' class=" inline-block px-2 py-2 text-base border-2 border-red-500 text-red-500 font-medium ml-auto
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

const closeContactsView=()=>{
    document.getElementById("allContactsView").classList.add('hidden');
    document.getElementById("contactNotif").classList.add('hidden');

}
