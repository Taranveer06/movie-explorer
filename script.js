const inputBtn= document.getElementById("searchBtn")

inputBtn.addEventListener("click",searching)
function searching(){
    const userInput= document.getElementById("searchInput").value
    const movieContainer= document.getElementById("movie-container")
    fetching(userInput,movieContainer)
   
   
        
}
async function fetching(userInput,movieContainer){
    try{
        const response = await fetch(`http://www.omdbapi.com/?s=${userInput}&apikey=c285b61e`)
        const data = await response.json()
     
        if (data["Response"]=="True"){
            console.log(data)
            
            data["Search"].map((x)=>{
                const card=`
                <div>
                <img src="${x["Poster"]}">
                <h3>${x.Title}</h3>
                <p>${x.Year}</p>
                </div>
                `
            movieContainer.innerHTML+=card
            })
        }else{
            return ("Movie Don't Exist.")
        }
        
        
    }
    catch(err){
        console.log(err)
    }
}



// OMDb API: http://www.omdbapi.com/?i=tt3896198&apikey=c285b61e