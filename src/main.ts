import tl = require('azure-pipelines-task-lib/task');
import path = require('path');
import * as azdev from "azure-devops-node-api";
import * as WikiApi from "azure-devops-node-api/WikiApi";
import * as WikiInterfaces from "azure-devops-node-api/interfaces/WikiInterfaces";
import * as lim from "azure-devops-node-api/interfaces/LocationsInterfaces";

async function run() {
    try {
        tl.setResourcePath(path.join( __dirname, 'task.json'));
        
        // Getting input values
        let orgUrl: string = tl.getInput('ADOBaseUrl',true);
        let repositoryName: string = tl.getInput("RNRepositoryName", true);
        let title: string = tl.getInput("RNTitle", true);
        let wikiRootSource: string = tl.getInput("WikiRoot", true);
        let releaseWikiName: string = tl.getInput("ReleseWiki", true);
        let versionNumber: string = tl.getInput("RNVersion", true);
        
        let token:string = process.env.SYSTEM_ACCESSTOKEN;
        let project:string = process.env.SYSTEM_TEAMPROJECT;

        console.log(`Using Project ${project}`);

        // Authenticating and connecting
        let authHandler = azdev.getPersonalAccessTokenHandler(token); 
        let webapi = new azdev.WebApi(orgUrl, authHandler, undefined);    
        let connData: lim.ConnectionData = await webapi.connect();
        
        console.log("Authentication good!");

        // Wiki Access
        let wikiApiObject: WikiApi.IWikiApi = await webapi.getWikiApi();
        console.log("Get all Wikis");

        const wikis: WikiInterfaces.WikiV2[] = await wikiApiObject.getAllWikis(project);
        console.log("Wikis", wikis.map((wiki) => wiki));


        // console.log("create a rest call to add page and/or content");
        // console.log("check if wiki is created otherwise create one and start adding paging/release with number");
        // console.log("build and release have options to pull workitems relared to build/release. pull them to build page content");
        //console.log(azureEndpoint);
    }
    catch (error) {
        tl.setResult(tl.TaskResult.Failed, error);
    }
}

run();