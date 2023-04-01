"use strict";

/*Esercizio:
Creare una fetch che mostri:
1. Nome e modello di tutte le navi di Star Wars raggruppate per
   manufacturer 
   DA MIGLIORARE, FARE UN ARRAY CHE I RIEMPIRà CON TUTTI I FABBRICANTI E POI RIEMPIRE LE COINCIDENZE DEI VEICOLI
2. Tutti i pianeti, con nome e qualcos'altro, che sono apparsi
   in almeno due film, con il titolo dei film in cui sono
   apparsi e nome e razza dei residenti di quel pianeta
-2a. Tutti i personaggi per cui quel pianeta è designato come
   "homeworld" (nome, razza)*/


   // table tr th testa tabbella /th th testa tabbella /th th testa tabbella /th /tr
// tr td  contenuto/td /tr tr td  contenuto/td /tr tr td  contenuto/td /tr tr td  contenuto/td /tr


const urlBase = 'https://swapi.dev/api/';
let result = [];

let filtered = false; //diventa true quando clicchi cerca con filtrato numero film
let numFilter = 0;
let selNumFilms = document.getElementById("numFilms");

let searchAll = document.getElementById("search");
searchAll.disabled = true;
searchAll.addEventListener("click", event => {
   numFilter = selNumFilms.options[selNumFilms.selectedIndex].value;
   if(numFilter > 0){
      filtered = true;
   }else{
      filtered = false; //per sicurezza, non si sa mai
   }
   this.showAllElements();
});
let selectArguments = document.getElementById("selcet-argument");
loadArguments();
let table = document.createElement("table");
selNumFilms.after(table);
let nextPageUrl = null;

let shipGroupBtn = document.getElementById("showShipGroup");
shipGroupBtn.addEventListener( "click", event => showShipsGrouped());

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
            argument.text = d;
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

   if(url.includes("films")){
      filtered = false;
   }
   fetch(url)//prende quello selezionato
      .then(response => {
         if (!response.ok) {
            throw new Error("error with takeAll!");
         }
         return response.json();
      })
      .then(data => {
         result = result.concat(data.results);
         if (data.next) { //controlla se c'è un altra pagina
            takeAllElements(data.next);
         }
         else {
            showAllElements(true);
         }
      })
      .catch(err => console.log(err));
}

function showAllElements(pieno) {

   if (pieno) {                        // pieno in realtà non si riferisce alla tabella su schermo, ma al result, quando 
      //svuota la tabella              // quando avrò finito di prendere tutti gli elementi da tutte le pagine, allora vado avanti
      table.innerHTML = "";
      //controllo se sto visualizando le navi
      if(selectArguments.options[selectArguments.selectedIndex].value == "starships"){
         result.sort((a,b)=>(a.manufacturer > b.manufacturer) ? 1:-1); //rileggere --> https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
      }
      //riempie tabella col result...
      //prima la thead
      let rowHead = document.createElement("tr");
      for (let r in result[0]) {
         let tHead = document.createElement("th");
         tHead.textContent = r;     //do il testo per ogni sezione
         rowHead.appendChild(tHead);
      }
      table.appendChild(rowHead);
      for (let r of result) {       //LEVARE TUTTI I FILTERED, LASCIARE CON FILTRO 0> AL MASSIMO
            if(filtered && r.films.length >= numFilter){          //if (filtered && r.films.length >= numFilter)
               table.appendChild(showWhatIWant(r));      // lo fa con pochi eletti, zoccola costosa
            } else if(!filtered) {
               table.appendChild(showWhatIWant(r)); //lo fa con tutti, zoccola
               console.log(filtered);
            }
      }
      //e alla fine azzera il res
      result = [];
      filtered = false;
   } else {
      takeAllElements(nextPageUrl);
   }
}

function showWhatIWant (r) {
   let rowBody = document.createElement("tr");
         for (let dats in r) {                           //mettere la porzione di codice qua sotto in una funzione
            let tData = document.createElement("td");
            if(r[dats].length > 0 && r[dats][0].includes("https://")){
               for(let ogniUrl of r[dats]){
                  let innerTData = document.createElement("td");
                  innerTData.classList.add("innerTData");
                  fetch(ogniUrl)
                  .then(response => {
                     if (!response.ok) {
                        throw new Error("error with multiLink property!");
                     }
                     return response.json();
                  })
                  .then(data => {
                     let stringaNome = document.createTextNode(Object.values(data)[0]); //non è una stringa! è un oggetto con node con valore tot
                     
                     innerTData.appendChild(stringaNome);
                  })
                  .catch (err=> console.log(err));
                  tData.appendChild(innerTData);
               }               
            } 
            else if (r[dats].length > 4 && r[dats].includes("https://")) {    //questo valuta quando c'è solo un link
            fetch(r[dats])
               .then(response => {
                  if (!response.ok) {
                     throw new Error("error with monoLink property!");
                  }
                  return response.json();
               })
               .then(data => {
                  tData.textContent = Object.values(data)[0]; //ritorna un array con tutti i valori dell oggetto di cui prendo il primo elemento 
               })                                             //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values da rileggere
               .catch (err=> console.log(err));
            }  
            else {
               tData.textContent = r[dats];
            }
            rowBody.appendChild(tData)
         }
         return rowBody;
}
// Nome e modello di tutte le navi di Star Wars raggruppate per
// manufacturer ... senza riutilizzare il codice sopra

function showShipsGrouped(){
   table.innerHTML = "";
   fetch(`${urlBase}starships/`)
   .then(response => {
      if (!response.ok) {
         throw new Error("error with monoLink property!");
      }
      return response.json();
   })
   .then(result => {
      let orderedByManu = orderElementsBy(result, "manufacturer");
      //mostrare

   })
   .catch (err=> console.log(err));
}

function orderElementsBy(arr, prop){
   //la mappa in js si def -> const map = new Map(); --> map.set('Key', {serie di valori associati, questo fra graffe sarebbe un oggetto con più proprietà per esempio})
   let posProp = 0;  //conservo la posizione della propietà per utilizzarla dopo
   let mapElements = new Map();
   while(Object.keys(arr.results[0])[posProp] != prop && Object.keys(arr.results[0]).length >= posProp){
      ++posProp;    
   }
   //altrimenti si ferma prima
   for(let element of arr.results){ //es. ship
      if(!mapElements.has(Object.values(element)[posProp])){ //es manufacturer
         mapElements.set(Object.values(element)[posProp], element.name);
      } else {
         let actualValue = mapElements.get(Object.values(element)[posProp]); //più leggibile
         mapElements.set(Object.values(element)[posProp], `${actualValue} *** ${element.name}`);
      }
   }
   posProp = 0;
   console.log(Object.keys(mapElements) + " " + mapElements);
   console.log(mapElements.keys() + " " + mapElements.values()); // <-- LA GIUSTA VIA
   console.log(mapElements.get('name'));
   console.log(mapElements.get());
}