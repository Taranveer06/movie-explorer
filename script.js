const inputBtn= document.getElementById("searchBtn")
const movieModal= document.getElementById("movie-modal")
const modalcontainer=document.getElementById("modal-content")
const togglebtn =document.getElementById("togglebtn");
togglebtn.addEventListener("click", function (){
  if (document.body.className==="light"){
    document.body.className="dark";
    btn.innerText ="Switch to Light Mode";
  } else{
    document.body.className ="light";
    btn.innerText ="Switch to Dark Mode"
  }
})
inputBtn.addEventListener("click",searching)
function searching(){
    const userInput= document.getElementById("searchInput").value
    const movieContainer= document.getElementById("movie-container")
    const filterData= document.getElementById("filter").value
    fetching(userInput,movieContainer,filterData)
}

async function movieDetails(imdbID){
    console.log(imdbID)
    

    try{
        const response= await fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=c285b61e`)
        const data=await response.json()
        if (data["Response"]=="True"){
            modalcontainer.innerHTML=""
            modalcontainer.innerHTML+=`
                
                <img src="${data.Poster}" />
                <div> 
                    <h1>${data["Title"]}</h1>
                    <h3>${data["Actors"]}</h3>
                    <h5>${data["Genre"]}</h5>
                    <p>${data["Plot"]}</p>
                    <p>${data["imdbRating"]}</p>
                </div>
                <button id="closeBtn">X</button>
               
            `
            console.log(movieModal)
           movieModal.style.display="flex"
           const closeBtn=document.getElementById("closeBtn")
           closeBtn.addEventListener("click",()=>{
                movieModal.style.display="none";
            })
        }
    }
    catch(err){
        console.log(err)
    }
}
async function fetching(userInput,movieContainer,filterData){
    try{
        const response = await fetch(`http://www.omdbapi.com/?s=${userInput}&apikey=c285b61e`)
        const data = await response.json()
     
        if (data["Response"]=="True"){
            console.log(data)
            
            let moviesdata= data["Search"]

            let movies=moviesdata.sort((a,b)=>Number(a["Year"])-Number(b["Year"]))
            movieContainer.innerHTML=""
            let filteredMovies=movies
            if (filterData=="movie" || filterData=="series"){
                filteredMovies=filteredMovies.filter((x)=>x["Type"]==filterData)
            }
            filteredMovies.forEach((x)=>{
                    if (x["Poster"]!=='N/A'){const card=`
                            <div class="movie-card" onclick="movieDetails('${x.imdbID}')">
                            <img src="${x["Poster"]}">
                            <h3>${x.Title}</h3>
                            <p>${x.Year}</p>
                            </div>
                        `
                    movieContainer.innerHTML+=card}
                
                    
                    
            
               
            })

    
        }else{
            return ("Movie Don't Exist.")
        }
        
        
    }
    catch(err){
        console.log(err)
    }
}



// OMDb API: http://www.omdbapi.com/?s=tt3896198&apikey=c285b61e