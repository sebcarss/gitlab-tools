# GitLab Tools
A collection of Node.js utilities for interacting with GitLab.

## Features

- Automate GitLab workflows
- Manage repositories and issues
- Integrate with GitLab APIs
- Export GitLab project data to CSV (and optionally Excel)

## Requirements

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

## Installation

```bash
npm install
```

## Setup

1. **GitLab API Token:**  
   You must set the `GITLAB_API_TOKEN` environment variable with a valid GitLab personal access token that has API access.

   On macOS/Linux:
   ```bash
   export GITLAB_API_TOKEN=your_token_here
   ```

   On Windows (Command Prompt):
   ```cmd
   set GITLAB_API_TOKEN=your_token_here
   ```

   Or, create a `.env` file in the project root and add:
   ```
   GITLAB_API_TOKEN=your_token_here
   ```
   (If you use a `.env` file, install the `dotenv` package and add `import 'dotenv/config'` at the top of `src/index.ts`.)

2. **Output Directory:**  
   The tool will create an `output` directory if it does not exist.  
   The exported data will be saved as `output/response.csv`.

## Usage

You can use the following npm scripts for development and running the tools:

### Run the main tool

```bash
npm start
```

### Development mode (with auto-reload)

```bash
npm run dev
```

### Build (compile TypeScript)

```bash
npm run build
```

### Serve compiled code

```bash
npm run serve
```

## Exporting Data

- The tool fetches all projects for the configured GitLab group (see `GITLAB_GROUP_ID` in `src/index.ts`).
- It exports the following fields for each project:
  - `id`
  - `name`
  - `name_with_namespace`
  - `created_at`
  - `last_activity_at`
  - `description`
  - `path`
  - `path_with_namespace`
  - `topics`
  - `web_url`
- The output is saved as `output/response.csv`, formatted for easy import into Excel.

## Configuration

- Update the group ID or API URL in `src/index.ts` as needed.
- Adjust exported fields in the same file if required.

## Contributing

Contributions are welcome! Please open issues or submit pull requests.

## License

MIT