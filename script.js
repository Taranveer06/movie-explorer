const inputBtn= document.getElementById("searchBtn")
const movieModal= document.getElementById("movie-modal")
const modalcontainer=document.getElementById("modal-content")
const togglebtn =document.getElementById("togglebtn");

const watchlist=[];
function addToWatchlist(imdbID,poster,title,year){
    watchlist.push({imdbID,poster,title,year})
}

////Toggle-theme
togglebtn.addEventListener("click", function (){
  if (document.body.className==="light"){
    document.body.className="dark";
    togglebtn.innerText ="Switch to Light Mode";
  } else{
    document.body.className ="light";
    togglebtn.innerText ="Switch to Dark Mode"
  }
})


/////searching
inputBtn.addEventListener("click",searching)
function searching(){
    const userInput= document.getElementById("searchInput").value
    const movieContainer= document.getElementById("movie-container")
    const filterData= document.getElementById("filter").value
    fetching(userInput,movieContainer,filterData)
}


////Clicked movie full detail
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
                    <button onclick="addToWatchlist('${data.imdbID}','${data.poster}','${data.title}','${data.year}')"> Add to watchlist</button>
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



////fetching data
async function fetching(userInput,movieContainer,filterData){
    try{
        const response = await fetch(`http://www.omdbapi.com/?s=${userInput}&apikey=c285b61e`)
        const data = await response.json()
        movieContainer.innerHTML=""
        if (data["Response"]=="True"){
            console.log(data)
            let moviesdata= data["Search"]
            let movies=moviesdata.sort((a,b)=>Number(a["Year"])-Number(b["Year"]))
            let filteredMovies=movies
            if (filterData=="movie" || filterData=="series"){
                filteredMovies=filteredMovies.filter((x)=>x["Type"]==filterData)
            }
            if (filteredMovies.length==0){
                const card=`<h1>This not exist</h1>`
                movieContainer.innerHTML=card
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
            movieContainer.innerHTML="Movie don't exist."
        }
    }
    catch(err){
        console.log(err)
    }
}



// OMDb API: http://www.omdbapi.com/?s=tt3896198&apikey=c285b61e