const axios = require('axios');
const GITLAB_API_TOKEN = process.env.GITLAB_API_TOKEN;

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
        const response = await axios.get(endpoint, options);
        return response.data;
    } catch (error: any) {
        console.log(error);
        return error;
    }
}

function main() {
    console.log("GitLab API Token is set");

    // Example usage of callApi function
    const exampleEndpoint = 'https://gitlab.com/api/v4/groups/115863492'; // Replace with a valid GitLab API endpoint
    callApi(exampleEndpoint, GITLAB_API_TOKEN as string)
        .then(data => {
            console.log("API Response:", data);
        })
        .catch(error => {
            console.error("Error calling API:", error);
        });
}

main();