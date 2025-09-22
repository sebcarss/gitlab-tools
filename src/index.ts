const axios = require('axios');
const fs = require('fs');
const path = require('path');
const GITLAB_API_TOKEN = process.env.GITLAB_API_TOKEN;
const GITLAB_URL = 'https://gitlab.com/api/v4';
const GITLAB_GROUP_ID = '115863492';

if (!GITLAB_API_TOKEN) {
    throw new Error("GITLAB_API_TOKEN is not set");
}

async function callApi(endpoint: string, accessToken: string): Promise<any> {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const response = await axios.get(endpoint, { ...options, validateStatus: () => true });
        return { data: response.data, headers: response.headers, status: response.status };
    } catch (error: any) {
        console.log(error);
        throw error;
    }
}

async function main() {
    const outputDir = path.join('./', 'output');
    const outputPath = path.join(outputDir, 'response.json');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    const PER_PAGE = 2;
    let pageNo = 1;
    let allNames: any[] = [];

    while (true) {
        const gitlabEndpoint = `${GITLAB_URL}/groups/${GITLAB_GROUP_ID}/projects?include_subgroups=true&per_page=${PER_PAGE}&page=${pageNo}`;
        try {
            const data = await callApi(gitlabEndpoint, GITLAB_API_TOKEN as string);

            if (Array.isArray(data.data)) {
                const projects = data.data.map((project: any) => ({
                    id: project.id,
                    description: project.description,
                    name: project.name,
                    name_with_namespace: project.name_with_namespace,
                    path: project.path,
                    path_with_namespace: project.path_with_namespace,
                    created_at: project.created_at,
                    topics: project.topics,
                    web_url: project.web_url,
                    last_activity_at: project.last_activity_at
                }));
                allNames.push(...projects);
                console.log(`Fetched ${projects.length} projects from page ${pageNo}`);
            }

            const nextPageHeader = data.headers['x-next-page'];
            if (nextPageHeader && nextPageHeader.trim() !== '') {
                pageNo = parseInt(nextPageHeader, 10);
            } else {
                break;
            }
        } catch (error) {
            console.error("Error calling API:", error);
            break;
        }
    }

    fs.writeFileSync(outputPath, JSON.stringify(allNames, null, 2));
    console.log(`All project names written to ${outputPath}`);
}

main();