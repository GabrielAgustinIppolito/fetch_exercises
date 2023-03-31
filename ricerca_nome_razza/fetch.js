"use strict";
let searchBtn = document.getElementById("search-btn");
searchBtn.addEventListener("click", event => {
   this.loadData();
})

const url = 'https://swapi.dev/api/';
let result = document.createElement("div");
searchBtn.after(result);

function loadData(){
   let input = document.getElementById("input").value;
   fetch(`${url}people?search=${input}`)
            .then(response => {
               if(!response.ok){
                  throw new Error("Fetch request failed!");
               }
               return response.json();
            })
            .then(data => {
               result.innerHTML =  `<p>I personaggi che contengono ${input} sono ${data.count}</p>`;
               for (let p of data.results) {
                  if(p.species.length == 0){
                     let pData = document.createElement("p");
                     pData.innerHTML =  `Nome: ${p.name}, Razza: Non Specificata`;
                     result.after(pData);
                  }
                  else{
                  fetch(p.species[0])
                        .then((response) => {
                           if(!response.ok){
                              throw new Error("Species request failed!");
                           }
                           return response.json();
                        })
                        .then((data) => {
                           let pData = document.createElement("p");
                           pData.innerHTML =  `Nome: ${p.name}, Razza: ${data.name}`;
                           result.after(pData);
                        });
                     }
               }
               
            })
            .catch(err=>console.log(err));
}

// fetch(url)
//          .then(response => response.json() )
//          .then( data => {
//             let element = document.getElementById("elem");
//             element.innerHTML = `
//                <p>${data.name}</p>
//                <p>${data.order}</p>
//                <img src='${data.sprites.front_default}'/>
//                `;
//          })
//          .catch(err=>console.log(err))