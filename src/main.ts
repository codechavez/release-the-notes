import tl = require('azure-pipelines-task-lib/task');
import path = require('path');
import { AzureRMEndpoint, dispose } from 'azure-pipelines-tasks-azure-arm-rest-v2/azure-arm-endpoint';
import { AzureEndpoint } from 'azure-pipelines-tasks-azure-arm-rest-v2/azureModels';
import * as azdev from "azure-devops-node-api";

async function run() {
    try {

        console.log("Step 1");
        tl.setResourcePath(path.join( __dirname, 'task.json'));
        console.log("Step 2");
        const connectedServiceName = tl.getInput('ConnectedServiceName',true);
        console.log(connectedServiceName);

        const repositoryName = tl.getInput("RNRepositoryName", true);
        console.log(repositoryName);
        
        const title = tl.getInput("RNTitle", true);
        console.log(title);
        
        const wikiRootSource = tl.getInput("WikiRoot", true);
        console.log(wikiRootSource);

        const releaseWikiName = tl.getInput("ReleseWiki", true);
        console.log(releaseWikiName);

        let token: string = process.env.AZURE_PERSONAL_ACCESS_TOKEN;
        console.log(token);

        console.log("Step 3.2")
        let authHandler = azdev.getPersonalAccessTokenHandler(token); 
        console.log("Step 3.3")
        let orgUrl = "https://dev.azure.com/teslacodenet";
        let connection = new azdev.WebApi(orgUrl, authHandler);    
        
        console.log(connection.serverUrl)

        console.log("Step 3.4")
        //let azureEndpoint: AzureEndpoint = await new AzureRMEndpoint(connectedServiceName).getEndpoint();

        console.log("Step 4");
        console.log(connectedServiceName);
        console.log(repositoryName);
        console.log(title);
        console.log(wikiRootSource);
        console.log(releaseWikiName);
        //console.log(azureEndpoint);
    }
    catch (error) {
        tl.setResult(tl.TaskResult.Failed, error);
    }
}

run();