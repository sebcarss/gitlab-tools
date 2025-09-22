const axios = require('axios');
const fs = require('fs');
const path = require('path');
const GITLAB_API_TOKEN = process.env.GITLAB_API_TOKEN;
const GITLAB_URL = 'https://gitlab.com/api/v4';

if (!GITLAB_API_TOKEN) {
    throw new Error("GITLAB_API_TOKEN is not set");
}

/**
 * Calls the endpoint with authorization bearer token.
 * @param endpoint The API endpoint URL.
 * @param accessToken The access token for authorization.
 */
async function callApi(endpoint: string, accessToken: string): Promise<any> {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    console.log('request made to web API at: ' + new Date().toString());

    try {
        const response = await axios.get(endpoint, { ...options, validateStatus: () => true });
        return { data: response.data, headers: response.headers, status: response.status };
    } catch (error: any) {
        console.log(error);
        return error;
    }
}

function main() {
    const outputDir = path.join('./', 'output');
    const outputPath = path.join(outputDir, 'response.json');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const PER_PAGE = 1;
    let pageNo = 1;


    const gitlabEndpoint = `${GITLAB_URL}/groups/115863492/projects?include_subgroups=true&per_page=${PER_PAGE}&page=${pageNo}`;
    callApi(gitlabEndpoint, GITLAB_API_TOKEN as string)
        .then(data => {
            const names = Array.isArray(data.data)
                ? data.data.map((project: any) => project.name_with_namespace)
                : [];
            console.log("Project names: ", names);
            fs.writeFileSync(outputPath, JSON.stringify(names, null, 2));
            console.log(`API response for page ${pageNo} written to ${outputPath}`);
            console.log("Next page: ", data.headers['x-next-page']);
        })
        .catch(error => {
            console.error("Error calling API:", error);
        });
}

main();