console.log('github wrapper');

const userNameInput = document.getElementById('userName');
const showDetailsButton = document.getElementById('showDetails');
const profileInfoDiv = document.getElementById('profileInfo')
const repoInfoDiv = document.getElementById('reposInfo')

function showRepoInfo(userName){
    fetch(`https://api.github.com/users/${userName}/repos?per_page=30&sort=updated`)
    .then((res) => res.json())
    .then((projects) => {
        console.log(projects);
        for(let i=0;i<projects.length;i++){
            repoInfoDiv.innerHTML += `<div class="card">
                
                <div class="card-title">
                    <div class="card-title">${projects[i].name}</div>
                    <div class="card-subHeading">${projects[i].language}</div>
                    <div class="card-text">
                    <p>${projects[i].description || 'No description available'}</p>
                    <p>Stars: ${projects[i].stargazers_count}, Forks: ${projects[i].forks_count}</p>
                        <p>Created on: ${new Date(projects[i].created_at).toLocaleDateString()}</p>
                        <p>Last updated: ${new Date(projects[i].updated_at).toLocaleDateString()}</p>
                    
                    <button>
                        <a href=${projects[i].html_url}>
                        Do CheckOUt
                        </a>
                    </button>
                    ${
                        projects[i].homepage 
                        ? `<p><a href="${projects[i].homepage}" target="_blank">Visit Project Website</a></p>`
                        : `<p>No homepage available</p>`
                    }
                    </div>
                </div>
            </div>`
        }
        
    })
}

showDetailsButton.addEventListener('click',() => {
    const userName = userNameInput.value;
    
    // request the data from server: fetch api
    fetch(`https://api.github.com/users/${userName}`)
        .then((res) => res.json())
        .then((data) =>{
            // console.log(data);
            profileInfoDiv.innerHTML = `<div class="card">
                <div class="card-img">
                    <img src= ${data.avatar_url} alt=${data.name} srcset="">
                </div>
                <div class="card-title">
                    <div class="card-title">${data.name}</div>
                    <div class="card-subHeading">${data.login}</div>
                    <div class="card-text">
                    <p>${data.bio}</p>
                    <p>${data.followers} followers ${data.following} following</p> 
                    </div>
                </div>
            </div>`

            
            showRepoInfo(userName);
        })


    
})

// Promises , resolve, reject, pending
// const p = new Promise((resolve,reject) =>{
//     const x = 1+5;
//     if(x===2){
//         resolve('Success');
//     }else{
//         reject('Failed');
//     }
// })

// // then will be executed whn promise resolve, otherwise catch will be executed
// p.then((data) => console.log(data)).catch((err) => console.log(err))