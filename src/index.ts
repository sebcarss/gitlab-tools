const GITLAB_API_TOKEN = process.env.GITLAB_API_TOKEN;

if (!GITLAB_API_TOKEN) {
    throw new Error("GITLAB_API_TOKEN is not set");
}

function main() {
    console.log("GitLab API Token is set");
}

main();