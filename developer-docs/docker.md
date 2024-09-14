# Docker Support

You can find Docker images here:

- [Alfresco Digital Workspace](https://quay.io/repository/alfresco/alfresco-digital-workspace?tab=tags)
- [Alfresco Control Center](https://quay.io/repository/alfresco/alfresco-control-center)

## Environment Variables

When using with containerised deployments, you can use the following environment variables to update application configuration values:

### Core

| Name                     | Config Path    |
|--------------------------|----------------|
| APP_CONFIG_ECM_HOST      | `ecmHost`      |
| APP_CONFIG_BPM_HOST      | `bpmHost`      |
| APP_CONFIG_AUTH_TYPE     | `authType`     |
| APP_CONFIG_PROVIDER      | `providers`    |
| APP_CONFIG_IDENTITY_HOST | `identityHost` |
| APP_BASE_SHARE_URL       | `baseShareUrl` |

### OAUTH2

| Name                                         | Config Path                      |
|----------------------------------------------|----------------------------------|
| APP_CONFIG_OAUTH2_HOST                       | `oauth2.host`                    |
| APP_CONFIG_OAUTH2_CLIENTID                   | `oauth2.clientId`                |
| APP_CONFIG_OAUTH2_CLIENT_SECRET              | `oauth2.secret`                  |
| APP_CONFIG_OAUTH2_IMPLICIT_FLOW              | `oauth2.implicitFlow`            |
| APP_CONFIG_OAUTH2_CODE_FLOW                  | `oauth2.codeFlow`                |
| APP_CONFIG_OAUTH2_AUDIENCE                   | `oauth2.audience`                |
| APP_CONFIG_OAUTH2_LOGOUT_URL                 | `oauth2.logoutUrl`               |
| APP_CONFIG_OAUTH2_LOGOUT_PARAMETERS          | `oauth2.logoutParameters`        |
| APP_CONFIG_OAUTH2_SCOPE                      | `oauth2.scope`                   |
| APP_CONFIG_OAUTH2_SILENT_LOGIN               | `oauth2.silentLogin`             |
| APP_CONFIG_OAUTH2_REDIRECT_SILENT_IFRAME_URI | `oauth2.redirectSilentIframeUri` |
| APP_CONFIG_OAUTH2_REDIRECT_LOGIN             | `oauth2.redirectUri`             |
| APP_CONFIG_OAUTH2_REDIRECT_LOGOUT            | `oauth2.redirectUriLogout`       |

### Plugins

| Name                               | Config Path                 |
|------------------------------------|-----------------------------|
| APP_CONFIG_PLUGIN_MICROSOFT_ONLINE | `plugins.microsoftOnline`   |
| APP_CONFIG_PLUGIN_AOS              | `plugins.aosPlugin`         |
| APP_CONFIG_PLUGIN_CONTENT_SERVICE  | `plugins.contentService`    |
| APP_CONFIG_PLUGIN_FOLDER_RULES     | `plugins.folderRules`       |
| APP_CONFIG_PLUGIN_PROCESS_SERVICE  | `plugins.processService`    |
| APP_CONFIG_PLUGIN_TAGS             | `plugins.tagsEnabled`       |
| APP_CONFIG_PLUGIN_CATEGORIES       | `plugins.categoriesEnabled` |
| APP_CONFIG_PLUGIN_LEGAL_HOLD       | `plugins.legalHoldEnabled`  |

### Office 365

| Name                                  | Config Path               |
|---------------------------------------|---------------------------|
| APP_CONFIG_PLUGIN_MICROSOFT_ONLINE    | `plugins.microsoftOnline` |
| APP_CONFIG_MICROSOFT_ONLINE_OOI_URL   | `msOnline.msHost`         |
| APP_CONFIG_MICROSOFT_ONLINE_CLIENTID  | `msOnline.msClientId`     |
| APP_CONFIG_MICROSOFT_ONLINE_AUTHORITY | `msOnline.msAuthority`    |
| APP_CONFIG_MICROSOFT_ONLINE_REDIRECT  | `msOnline.msRedirectUri`  |

### Pendo

Pendo is a product-analytics app which allows product teams to record, monitor and analyze how users interact with app. It also lets embed survey questions and polls into the app.

| Name                                        | Config Path                      |
|---------------------------------------------|----------------------------------|
| APP_CONFIG_ANALYTICS_PENDO_ENABLED          | `analytics.pendoEnabled`         |
| APP_CONFIG_ANALYTICS_PENDO_KEY              | `analytics.pendoKey`             |
| APP_CONFIG_ANALYTICS_PENDO_EXCLUDE_ALL_TEXT | `analytics.pendoExcludeAllText ` |
| APP_CONFIG_CUSTOMER_NAME                    | `analytics.pendoCustomerName`    |
