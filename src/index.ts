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

async function main() {
    const outputDir = path.join('./', 'output');
    const outputPath = path.join(outputDir, 'response.json');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Ensure response.json is empty on first run
    if (fs.existsSync(outputPath)) {
        fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
    }

    const PER_PAGE = 1;
    let pageNo = 1;
    let hasNextPage = true;

    while (hasNextPage) {
        const gitlabEndpoint = `${GITLAB_URL}/groups/115863492/projects?include_subgroups=true&per_page=${PER_PAGE}&page=${pageNo}`;
        try {
            const data = await callApi(gitlabEndpoint, GITLAB_API_TOKEN as string);

            // Extract project names from the response data
            const names = Array.isArray(data.data)
                ? data.data.map((project: any) => project.name_with_namespace)
                : [];
            console.log("Project names: ", names);

            // Write the names to a JSON file
            // Read existing names if the file exists, otherwise start with an empty array
            let existingNames: string[] = [];
            if (fs.existsSync(outputPath)) {
                const fileContent = fs.readFileSync(outputPath, 'utf-8');
                try {
                    existingNames = JSON.parse(fileContent);
                } catch {
                    existingNames = [];
                }
            }
            // Concatenate new names and write back to the file
            const allNames = existingNames.concat(names);
            fs.writeFileSync(outputPath, JSON.stringify(allNames, null, 2));
            console.log(`API response for page ${pageNo} written to ${outputPath}`);
            console.log("Next page: ", data.headers['x-next-page']);

            // Handle pagination
            let nextPageHeader = data.headers['x-next-page'];
            if (nextPageHeader && nextPageHeader.trim() !== '') {
                pageNo = parseInt(nextPageHeader, 10);
                console.log("Updated pageNo: ", pageNo);
            } else {
                console.log("No more pages to fetch.");
                hasNextPage = false; // Set to false to exit the loop
            }
        } catch (error) {
            console.error("Error calling API:", error);
            hasNextPage = false;
        }
    }
}

main();