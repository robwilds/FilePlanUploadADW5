# Customization getting started
There's a fully composed yaml file that contains the entries for the customized ADW implementation with file plan upload, the microservice (python app) to process the requests and the entire Alfresco 23.3 enterprise stack.  Simply run docker compose up -d to fire up the solution.  

There are volumes setup to configure nginx for the custom ADW and the provided nginx container for alfresco.  The yaml also has environment variables for the microservice (queryalfrescoapi) to run properly however when running locally you should not have to modify these values
      
# Customization details
1.  Verify the python microservice is running by accessing http://localhost:9600.  you should see swagger

2.  Verify the custom adw app is available by access http://localhost:8080/fileplanupload.  you should see ADW.  Click on "All Libraries" and you should see a button called "File Plan UPload"

3.  App must be licensed FIRST to run this step !!!.  If you would like to install OOTB support tools, run the install_amps.sh file in the supportTools directory then restart the alfresco and share containers

# Running the File Plan Upload
  There is a csv file located within this project called grs-csv-transmittal34-USE_THIS.csv.  This contains 3 entries that can be used as an initial load of file plans.  The Record title, classification general and retention years columns are the primary columns to exhibit in a demo.  You can also edit the notes columns.   Changing these values will reflect nicely in the records management site in ADW or Share but Share will give more details as to the retention schedule.  

Step 1.  click on all libraries and observe a button called File Plan Upload
<img width="849" alt="image" src="https://github.com/user-attachments/assets/544ca0ec-84bc-40af-94b8-fb2a00abd436">

Step 2.  click the choose file button and select your file
<img width="489" alt="image" src="https://github.com/user-attachments/assets/c8a2252b-f5d7-41a8-ac7c-188df59cd86f">

Step 3.  now you will see a list of all the rows in the spreadsheet.  You can select the rows you'd like to import then click submit
<img width="934" alt="image" src="https://github.com/user-attachments/assets/b4a95713-6547-4d45-8b98-9fc63c02ba4c">

you will see a confirmation that the file plans were added.  you can now click off of the modal popup and navigate to the Records Management Site to see the file plans

  the general taxonomy is
```
  Classification general (root)
  --- Record Title (this has the file plan)
  ------- All Files (folder to actual store the records)
```
# Alfresco Applications

The repository is based on the [Nx Workspace](https://nx.dev/) and contains the following Alfresco applications and libraries built with Angular and [ADF](https://github.com/Alfresco/alfresco-ng2-components):

- [Alfresco Control Center](./apps/admin-cc/README.md) (admin-cc)
- [Alfresco Digital Workspace](./apps/content-ee/README.md) (content-ee)

## Compatibility

| Application | ACS       | Node | ADF   | Angular |
|-------------|-----------|------|-------|---------|
| ACC 8.2     | 23.1.0-M4 | 18.x | 6.3.0 | 14.x    |
| ACC 8.1     | 7.4       | 18.x | 6.1.0 | 14.x    |
| ACC 8.0     | 7.4       | 14.x | 6.0.0 | 14.x    |

| Application | ACS       | Node | ADF   | ACA   | Angular |
|-------------|-----------|------|-------|-------|---------|
| ADW 4.2     | 23.1.0-M4 | 18.x | 6.3.0 | 4.2.0 | 14.x    |
| ADW 4.1     | 7.4       | 18.x | 6.1.0 | 4.1.0 | 14.x    |
| ADW 4.0     | 7.4       | 14.x | 6.0.0 | 4.0.0 | 14.x    |

### See Also

- [Windows Support](./developer-docs/windows.md)
- [Node Version Manager](./developer-docs/nvm.md)
- [Docker Support](./developer-docs/docker.md)
- [Linking with ACA and ADF](./developer-docs/linking.md)
- [Releasing](./developer-docs/release.md)
- [End-to-End Testing](./developer-docs/e2e.md)

## Setup

Install the Nx CLI tool:

```sh
npm install --global nx@latest
```

In the project root folder, create an `.env` file:

```bash
BASE_URL="<url>"
```

## Running

Run the following commands to run either `admin-cc` or `content-ee`:

```bash
npm install
npm start <admin-cc|content-ee>
```

The application is served and opened at `http://localhost:4200` by default.

## Building

Use one of the following commands to build the application for distribution:

```bash
# develop build
npm run build <admin-cc|content-ee>

# Production build
npm run build <admin-cc|content-ee> -- --prod
```

## Composing Plugins for ADW

You can also pick which plugins get into the final build by running:

```shell
# select the plugins and build the ADW app
npm run compose-build

# select the plugins and serve the ADW app
npm run compose-serve
```

You can also use the following command to serve the app with a custom set of plugins:

```bash
nx compose content-ee
```

You can select one, multiple, or all available plugins:

```shell
ADW Compose v0.1.0
? Plugins to use (Press <space> to select, <a> to toggle all, <i> to invert sele
ction)
❯◯ Alfresco Office Services (AOS)
 ◯ Alfresco About
 ◯ Analytics
 ◯ Content Services
 ◯ Governance
 ◯ Office365
```

## Distributing Applications

Run the `pack` command to create a distributable artifacts:

```bash
nx pack admin-cc
nx pack admin-cc --configuration=production

nx pack content-ee
nx pack content-ee --configuration=production
```

Which produces the following output:

```bash
dist/artifacts/alfresco-control-center-7.8.0.sha1
dist/artifacts/alfresco-control-center-7.8.0.zip

dist/artifacts/alfresco-digital-workspace-4.0.0-A.2.sha1
dist/artifacts/alfresco-digital-workspace-4.0.0-A.2.zip
```

To verify the distribution:

```bash
shasum --check alfresco-control-center-7.8.0.sha1
```

## Unit Tests

Use the following command to run the unit tests:

```bash
nx test <project name>
```

### Code Coverage

Use the following command to run tests with code coverage report:

```bash
# Generate code coverage for a specific project
nx test <project name> --codeCoverage

# Generate code coverage for everything
nx affected:test -- --all --code-coverage
```

## Upgrading Dependencies

To upgrade to the latest versions of ADF and ACA dependencies, run the following command:

```shell
npm run adf-update
```

That is an interactive script that allows you to pick from the following options to upgrade:

- ADF libraries
- JS-API library
- ACA libraries

