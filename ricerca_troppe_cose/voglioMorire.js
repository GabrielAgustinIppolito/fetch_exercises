"use strict";

/*Esercizio:
Creare una fetch che mostri:
1. Nome e modello di tutte le navi di Star Wars raggruppate per
   manufacturer 
   
2. Tutti i pianeti, con nome e qualcos'altro, che sono apparsi
   in almeno due film, con il titolo dei film in cui sono
   apparsi e nome e razza dei residenti di quel pianeta
-2a. Tutti i personaggi per cui quel pianeta è designato come
   "homeworld" (nome, razza)*/


   // table tr th testa tabbella /th th testa tabbella /th th testa tabbella /th /tr
// tr td  contenuto/td /tr tr td  contenuto/td /tr tr td  contenuto/td /tr tr td  contenuto/td /tr


const urlBase = 'https://swapi.dev/api/';

let searchAll = document.getElementById("search-all");
let result = [];
searchAll.addEventListener("click", event => this.showAllElements());
searchAll.disabled = true;
let selectArguments = document.getElementById("selcet-argument");
loadArguments();
let table = document.createElement("table");
searchAll.after(table);
let nextPageUrl = null;


function loadArguments() {
   fetch(urlBase)
      .then(response => {
         if (!response.ok) {
            throw new Error("error with loadArguments!");
         }
         return response.json();
      })
      .then(data => {
         for (let d in data) {
            let argument = document.createElement("option");
            argument.text = d; //"" + d -> non c'è bisogno, è già formato testo
            selectArguments.add(argument);
         }
         searchAll.disabled = false;
      })
      .catch(err => console.log(err));
}

function takeAllElements(nextP) {
   let url;
   if (!nextP) {
      url = `${urlBase}${selectArguments.options[selectArguments.selectedIndex].value}`;
   } else {
      url = nextP;

   }
   // console.log(url);
   fetch(url)//prende quello selezionato
      .then(response => {
         if (!response.ok) {
            throw new Error("error with showAll!");
         }
         return response.json();
      })
      .then(data => {
         result = result.concat(data.results);
         if (data.next) { //controlla se c'è un altr pagina
            takeAllElements(data.next);
         }
         else {
            showAllElements(true);
         }
      })
      .catch(err => console.log(err));
}

function showAllElements(pieno) {
   if (pieno) {
      //svuota la tabella
      table.innerHTML = "";
      //controllo se sto visualizando le navi
      if(selectArguments.options[selectArguments.selectedIndex].value == "starships"){
         result.sort((a,b)=>(a.manufacturer > b.manufacturer) ? 1:-1); //rileggere --> https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
      }
      //riempie tabella col result...
      let rowHead = document.createElement("tr");
      for (let r in result[0]) {
         let tHead = document.createElement("th");
         tHead.textContent = r;     //do il testo per ogni sezione
         rowHead.appendChild(tHead)
      }
      table.appendChild(rowHead);

      for (let r of result) {
         let rowBody = document.createElement("tr");
         for (let dats in r) {
            let tData = document.createElement("td");
            // console.log(r[dats].length + " di " + r[dats]);
            // if(r[dats].length > 0 && r[dats][0].includes("https://")){
            //    console.log("***********************\n" + r[dats]);
            //    for (let ogniUrl of r[dats]){       //è un array normale, non di oggetti
            //       console.log(ogniUrl);
            //    }
            // }
            
            if(r[dats].length > 0 && r[dats][0].includes("https://")){
               for(let ogniUrl of r[dats]){
                  fetch(ogniUrl)
                  .then(response => {
                     if (!response.ok) {
                        throw new Error("error with showAll!");
                     }
                     return response.json();
                  })
                  .then(data => {
                     let stringaNome = document.createTextNode(Object.values(data)[0]);
                     console.log(stringaNome);
                     tData.appendChild(stringaNome);
                  })
                  .catch (err=> console.log(err));
               }
               
               
            } else if (r[dats].includes("https://")) {    //questo valuta quando c'è solo un link
            // tData.textContent = takeName(r[dats]); sogno erotico che non potrò mai realizzare
            fetch(r[dats])
               .then(response => {
                  if (!response.ok) {
                     throw new Error("error with showAll!");
                  }
                  return response.json();
               })
               .then(data => {
                  tData.textContent = Object.values(data)[0]; //ritorna un array con tutti i valori del oggetto di cui prendo il primo elemento https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values da rileggere
               })
               .catch (err=> console.log(err));
            }  
            else {
               tData.textContent = r[dats];
            }
            rowBody.appendChild(tData)
         }
         table.appendChild(rowBody);
      }
      //e alla fine azzera il res
      result = [];
      console.log("ho finito di mostrare cose belle")
   } else {
      takeAllElements(nextPageUrl);
   }
}

// function takeName(urlSpecifico) { //qui mi prendo la prima cosa che trova (nome o nel caso dei film - titolo)
   
//       
// }