const inputBtn= document.getElementById("searchBtn")
const movieModal= document.getElementById("movie-modal")
const modalcontainer=document.getElementById("modal-content")
const togglebtn =document.getElementById("togglebtn");
const watchlistbtn=document.getElementById("watchlist");
const watchlistModal= document.getElementById("watchlist-modal")
const watchlistContent= document.getElementById("watchlist-content");
const watchlistCloseBtn= document.getElementById("watchlist-closebtn");
const action= document.getElementById("action")
const stars=document.getElementById("stars")
const firstPage=document.getElementById("firstPage")
const homeBtn = document.getElementById("homeBtn");
homeBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    document.getElementById("hero").style.display = "flex";
    firstPage.style.display = "block";
    document.getElementById("movie-container").style.display = "none";
});



watchlistCloseBtn.addEventListener("click",()=>{
        watchlistModal.style.display="none"
    })
watchlistCloseBtn.onclick = () => {
    watchlistModal.style.display = "none";
};
let watchlist=JSON.parse(localStorage.getItem("watchlist"))||[];
function saveToLocalStorage(){
    localStorage.setItem("watchlist",JSON.stringify(watchlist))
}
function removingMovie(imdbID){
    watchlist =watchlist.filter(x=>x.imdbID!=imdbID)
    saveToLocalStorage()
    moviesToWatch()
}

watchlistbtn.addEventListener("click",moviesToWatch)
function moviesToWatch(){
    watchlistContent.innerHTML=""
    console.log(watchlist)


    if (watchlist.length==0){
        watchlistContent.innerHTML="<h3>No movies in Watchlist.</h3>"
    }
    watchlist.forEach((x)=>{

        const watchlistcard=`
                            <div class="movie-card" onclick="movieDetails('${x.imdbID}')">
                            <img src="${x["poster"]}">
                            <h3>${x.title}</h3>
                            <p>${x.year}</p>
                            <button onclick="event.stopPropagation(); removingMovie('${x.imdbID}')">Remove</button>
                            </div>
                        `
                    watchlistContent.innerHTML+=watchlistcard
                }
    )
    watchlistModal.style.display="flex"
}

function addToWatchlist(imdbID,poster,title,year){
    const exist = watchlist.filter((x)=>x.imdbID==imdbID)
    if (exist.length!==0){
        alert("This movie already exist")
        return 
    }
    watchlist.push({imdbID,poster,title,year})
    saveToLocalStorage()
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
function updateWatchButton(imdbID){
    const btn = document.getElementById("watchBtn");
    const exists = watchlist.find(x => x.imdbID == imdbID);

    if(exists){
        btn.innerText = "Remove from Watchlist";
        btn.style.background = "gray";
    } else {
        btn.innerText = "Add to Watchlist";
        btn.style.background = "red";
    }
}

function toggleWatchlist(imdbID,poster,title,year){
    const exists = watchlist.find(x => x.imdbID == imdbID);

    if(exists){
        watchlist = watchlist.filter(x => x.imdbID != imdbID);
    } else {
        watchlist.push({imdbID,poster,title,year});
    }

    saveToLocalStorage();
    updateWatchButton(imdbID);
}



/////searching
inputBtn.addEventListener("click",searching)
function searching(){
    firstPage.style.display="none"
    const userInput= document.getElementById("searchInput").value
    const movieContainer= document.getElementById("movie-container")
    const filterData= document.getElementById("filter").value
    document.getElementById("hero").style.display = "none";
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
                    <button onclick="addToWatchlist('${data.imdbID}','${data.Poster}','${data.Title}','${data.Year}')"> Add to watchlist</button>
                </div>
                <button id="closeBtn" background-color="red">X</button>
               
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
    movieContainer.innerHTML=""
    movieContainer.innerHTML+=`<h1>Loading....</h1>`
    try{
        const response = await fetch(`http://www.omdbapi.com/?s=${userInput}&apikey=c285b61e`)
        const data = await response.json()
        movieContainer.innerHTML=""
        movieContainer.style.display="flex"
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
async function homePage(){
    try{
        const response= await fetch(`http://www.omdbapi.com/?s=batman&apikey=c285b61e`)
        const data=await response.json()
        console.log(data)
        action.innerHTML=""
        if (data["Response"]=="True"){
            console.log(data)
            let moviesdata= data["Search"]
            let movies=moviesdata.sort((a,b)=>Number(a["Year"])-Number(b["Year"]))
            let filteredMovies=movies
            
            if (filteredMovies.length==0){
                const card=`<h1>This not exist</h1>`
                action.innerHTML=card
            }
            filteredMovies.forEach((x)=>{
                    if (x["Poster"]!=='N/A'){const card=`
                            <div class="movie-card" onclick="movieDetails('${x.imdbID}')">
                            <img src="${x["Poster"]}">
                            <h3>${x.Title}</h3>
                            <p>${x.Year}</p>
                            </div>
                        `
                    action.innerHTML+=card}
            })
    }   const response1= await fetch(`http://www.omdbapi.com/?s=stars&apikey=c285b61e`)
        const data1=await response1.json()
        console.log(data1)
        stars.innerHTML=""
        if (data1["Response"]=="True"){
            console.log(data1)
            let moviesdata1= data1["Search"]
            let movies=moviesdata1.sort((a,b)=>Number(a["Year"])-Number(b["Year"]))
            let filteredMovies=movies
            
            if (filteredMovies.length==0){
                const card=`<h1>This not exist</h1>`
                stars.innerHTML=card
            }
            filteredMovies.forEach((x)=>{
                    if (x["Poster"]!=='N/A'){const card=`
                            <div class="movie-card" onclick="movieDetails('${x.imdbID}')" >
                            <img src="${x["Poster"]}">
                            <h3>${x.Title}</h3>
                            <p>${x.Year}</p>
                            </div>
                        `
                    stars.innerHTML+=card}
            })
        }else{
            stars.innerHTML="Movie don't exist."
         
        }const response2= await fetch(`http://www.omdbapi.com/?s=comedy&apikey=c285b61e`)
        const data2=await response2.json()
        console.log(data1)
        comedy.innerHTML=""
        if (data2["Response"]=="True"){
            console.log(data2)
            let moviesdata1= data2["Search"]
            let movies=moviesdata1.sort((a,b)=>Number(a["Year"])-Number(b["Year"]))
            let filteredMovies=movies
            
            if (filteredMovies.length==0){
                const card=`<h1>This not exist</h1>`
                comedy.innerHTML=card
            }
            filteredMovies.forEach((x)=>{
                    if (x["Poster"]!=='N/A'){const card=`
                            <div class="movie-card" onclick="movieDetails('${x.imdbID}')" >
                            <img src="${x["Poster"]}">
                            <h3>${x.Title}</h3>
                            <p>${x.Year}</p>
                            </div>
                        `
                    comedy.innerHTML+=card}
            })
        }else{
            comedy.innerHTML="Movie don't exist."
         
        }}
    catch(err){
        console.log(err)
    }
}

homePage()
// OMDb API: http://www.omdbapi.com/?s=tt3896198&apikey=c285b61e