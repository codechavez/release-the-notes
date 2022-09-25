# Release the Notes

it's a small TypeScript code that creates a release notes page inside of you Azure DevOps's Wiki. It gets the work items related to the build so it can add them into the wiki page.

The structure is as follow (default settings)

- YOUR ROOT WIKI
    - Release
        - YOUR REPO NAME
            - note
            - note
            - note
            
The "note" is actually the version number, so I would recommend to use some sort of versioning tool such as gitVersion or any of your preference.

> REQUIRES: Checked --> Allow scripts to access the OAuth token on the Agent.

> REQUIRES: Add Permission to build pipeline. [link](https://learn.microsoft.com/en-us/azure/devops/project/wiki/manage-readme-wiki-permissions?view=azure-devops)


## Screenshots
![nodescreen](https://generalstorage1986.blob.core.windows.net/images/notes_screen.png)

![nodescreen2](https://generalstorage1986.blob.core.windows.net/images/note_screen_configs.png)

