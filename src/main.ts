import tl = require('azure-pipelines-task-lib/task');
import path = require('path');
import * as azdev from "azure-devops-node-api";
import * as WikiApi from "azure-devops-node-api/WikiApi";
import * as WikiInterfaces from "azure-devops-node-api/interfaces/WikiInterfaces";
import * as lim from "azure-devops-node-api/interfaces/LocationsInterfaces";
import * as WikiPageApi from './services/WikiPages'
import * as ba from "azure-devops-node-api/BuildApi";
import * as bi from "azure-devops-node-api/interfaces/BuildInterfaces";


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
        let buildId:string = process.env.BUILD_BUILDID;
        console.log(`BuildId: ${buildId}`);

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

        let wikiUrl = wikis[0].url;

        let wikiPageApi = new WikiPageApi.WikiPageApi;
        let wikipages: WikiInterfaces.WikiPage[] = await wikiPageApi.getPages(wikiUrl, 100, token);
        console.log(wikipages);
        console.log(`Getting page ${wikipages[0].path}`)

        let wikiPage:WikiPageApi.WikiPageWithContent = await wikiPageApi.getPage(wikiUrl, wikipages[0].path, token);
        console.log(wikiPage);

        console.log(`Getting workItems in build`);
        let buildObject: ba.IBuildApi = await webapi.getBuildApi();
        let workItems = await buildObject.getBuildWorkItemsRefs(project,Number(buildId));
        console.log("workitems", workItems.map((wi) => wi));

        // get work items
    }
    catch (error) {
        tl.setResult(tl.TaskResult.Failed, error);
    }
}

run();