const userNameInput = document.getElementById('userName');
const showDetailsButton = document.getElementById('showDetails');
const profileInfoDiv = document.getElementById('profileInfo');
const reposInfoDiv = document.getElementById('reposInfo');

// using async and await
showDetailsButton.addEventListener('click', async () => {
    const userName = userNameInput.value.trim();

    if (!userName) {
        profileInfoDiv.innerHTML = '<p>Please enter a GitHub username.</p>';
        return;
    }

    // Clear previous data and show loading state
    profileInfoDiv.innerHTML = '<p>Loading profile...</p>';
    reposInfoDiv.innerHTML = '<p>Loading repositories...</p>';

    try {
        // Fetch user profile
        const res = await fetch(`https://api.github.com/users/${userName}`);
        
        if (!res.ok) throw new Error('User not found');
        
        const data = await res.json();
        showProfile(data);
        showReposInfo(userName);
    } catch (error) {
        profileInfoDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        reposInfoDiv.innerHTML = ''; // Clear repos info if there's an error
    }
});

function showProfile(data) {
    profileInfoDiv.innerHTML = `
        <div class="card">
            <div class="card-img">
                <img src="${data.avatar_url}" alt="${data.name}">
            </div>
            <div class="card-body">
                <div class="card-title">${data.name || 'Name not available'}</div>
                <div class="card-subHeading">@${data.login}</div>
                <div class="card-text">
                    <p>${data.bio || 'No bio available'}</p>
                    <p>${data.followers} followers, ${data.following} following</p>
                    <button>
                        <a href="${data.html_url}" target="_blank" rel="noopener noreferrer">
                            View Profile
                        </a>
                    </button>
                </div>
            </div>
        </div>`;
}

async function showReposInfo(userName) {
    try {
        const res = await fetch(`https://api.github.com/users/${userName}/repos?per_page=30&sort=updated`);
        
        if (!res.ok) throw new Error('Could not fetch repositories');
        
        const projects = await res.json();
        reposInfoDiv.innerHTML = ''; // Clear loading message after fetch

        if (projects.length === 0) {
            reposInfoDiv.innerHTML = '<p>No repositories available.</p>';
            return;
        }

        projects.forEach((project) => {
            reposInfoDiv.innerHTML += `
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">${project.name}</div>
                        <div class="card-subHeading">${project.language || 'Language not specified'}</div>
                        <div class="card-text">
                            <p>${project.description || 'No description available'}</p>
                            <button>
                                <a href="${project.html_url}" target="_blank" rel="noopener noreferrer">
                                    View Project
                                </a>
                            </button>
                        </div>
                    </div>
                </div>`;
        });
    } catch (error) {
        reposInfoDiv.innerHTML = `<p>Error loading repositories: ${error.message}</p>`;
    }
}
