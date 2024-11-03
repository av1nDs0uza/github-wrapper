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

        for (const project of projects) {
            // Fetch languages for each repo
            const languagesRes = await fetch(project.languages_url);
            const languages = await languagesRes.json();

            reposInfoDiv.innerHTML += `
                <div class="card">
                    <div class="card-body">
                        <div class="card-title">${project.name}</div>
                        <div class="card-subHeading">${Object.keys(languages).join(", ") || 'Languages not specified'}</div>
                        <div class="card-text">
                            <p>${project.description || 'No description available'}</p>
                            <p>⭐ ${project.stargazers_count} | 🍴 ${project.forks_count}</p>
                            <button>
                                <a href="${project.html_url}" target="_blank" rel="noopener noreferrer">
                                    View Project
                                </a>
                            </button>
                        </div>
                    </div>
                </div>`;
        }
    } catch (error) {
        reposInfoDiv.innerHTML = `<p>Error loading repositories: ${error.message}</p>`;
    }
}

async function showAnalytics(userName) {
    const analyticsDiv = document.getElementById('analyticsInfo');
    analyticsDiv.innerHTML = '<p>Loading analytics...</p>';

    try {
        // Fetch repositories to get the list of repo names
        const res = await fetch(`https://api.github.com/users/${userName}/repos?per_page=10&sort=updated`);
        if (!res.ok) throw new Error('Could not fetch repositories');

        const repos = await res.json();
        analyticsDiv.innerHTML = ''; // Clear loading message

        for (const repo of repos) {
            const commitsRes = await fetch(`https://api.github.com/repos/${userName}/${repo.name}/commits`);
            const commits = await commitsRes.json();

            // Display repo name and commit count
            analyticsDiv.innerHTML += `
                <div class="card">
                    <h3>${repo.name}</h3>
                    <p>Commits: ${commits.length}</p>
                </div>
            `;
        }
    } catch (error) {
        analyticsDiv.innerHTML = `<p>Error loading analytics: ${error.message}</p>`;
    }
}

// Call showAnalytics function in the main button click listener
showDetailsButton.addEventListener('click', () => {
    const userName = userNameInput.value.trim();
    if (userName) showAnalytics(userName);
});

async function getCommitHistory(userName, repoName) {
    try {
        const res = await fetch(`https://api.github.com/repos/${userName}/${repoName}/commits?per_page=100`);
        if (!res.ok) throw new Error('Could not fetch commit history');
        
        const commits = await res.json();
        
        // Calculate commit frequency
        const commitFrequency = commits.reduce((acc, commit) => {
            const date = new Date(commit.commit.author.date).toDateString(); // Group by day
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return commitFrequency;
    } catch (error) {
        console.error(`Error fetching commits for ${repoName}: ${error.message}`);
        return {};
    }
}

