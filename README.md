# Customization getting started
In order to utilize this customization within an existing Alfresco docker collection, add the following section to the docker-compose.yml for alfresco

  fileplanuploadadw5:
  
    image: wildsdocker/fileplanuploadadw5:v1
    ports:
      - 4200:80
      
# Customization details
This build of ADW 5 has a component for uploading file plan spreadsheets and creating retention categories with the file plan in Alfresco.

In order to utilize the angular app, a modification must be made to the existing alfresco nginx provided proxy container (running nginx).  On the "proxy" container, edit the etc/nginx/nginx.conf and add the following entry in the server section

                                                                    
        location /fileupload/ {                                                                  
            proxy_pass http://fileplanuploadadw5/;                                               
            absolute_redirect off;                                                               
        }     

this will setup an endpoint like:  localhost:8080/fileupload which will proxy over to this custom ADW app

#  Using File Plan Upload

Once the angular app loads, click on "All Libraries"  .  You will see a button called import file plans.  clicking this button will show a dialog where you can select the csv file that contains the file plans.  Selecting a file will show the next screen where you can select/de-select rows then click submit.  

The confirmation screen will indicate success or failure of the upload.  If successful, you can now go to the library> REcords Management and view the file plans in ADW.  Share interface will show more details about the file plan such as the retention schedule

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

