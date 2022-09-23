import tl = require('azure-pipelines-task-lib/task');
import path = require('path');
import * as azdev from "azure-devops-node-api";
import * as WikiApi from "azure-devops-node-api/WikiApi";
import * as WikiInterfaces from "azure-devops-node-api/interfaces/WikiInterfaces";
import * as lim from "azure-devops-node-api/interfaces/LocationsInterfaces";
import * as WikiPageApi from './services/WikiPages'
import * as ba from "azure-devops-node-api/BuildApi";
import * as bi from "azure-devops-node-api/interfaces/BuildInterfaces";
import * as WorkItemTrackingApi from 'azure-devops-node-api/WorkItemTrackingApi';
import * as WorkItemTrackingInterfaces from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';


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

        // Get Wiki's Pages
        let wikiUrl = wikis[0].url;

        let wikiPageApi = new WikiPageApi.WikiPageApi;
        let wikipages: WikiInterfaces.WikiPage[] = await wikiPageApi.getPages(wikiUrl, 100, token);
        console.log(wikipages);
        console.log(`Getting page ${wikipages[0].path}`)

        let wikiPage:WikiPageApi.WikiPageWithContent = await wikiPageApi.getPage(wikiUrl, wikipages[0].path, token);
        console.log(wikiPage);

        // Get Build's related workitems
        console.log(`Getting workItems in build`);
        let buildObject: ba.IBuildApi = await webapi.getBuildApi();
        let buildWorkItems = await buildObject.getBuildWorkItemsRefs(project,Number(buildId));
        console.log("workitems", buildWorkItems.map((wi) => wi));

        let workItemObject: WorkItemTrackingApi.IWorkItemTrackingApi = await webapi.getWorkItemTrackingApi();
        let wiDetails: WorkItemTrackingInterfaces.WorkItem[] = [];

        for(let item of buildWorkItems){
            wiDetails.push(await workItemObject.getWorkItem(Number(item.id)));
        }
        //console.log(wiDetails);

        let workItems: WikiPageApi.IWorkItemDetail[] =[];

        wiDetails.forEach(function(item){
            workItems.push({
                id:item.id,
                type:item.fields["System.WorkItemType"],
                url:item.url
            } as WikiPageApi.IWorkItemDetail)

            //console.log(`WORK ITEM TYPE ${item.fields["System.WorkItemType"]}`);
        });
        
        let itemTypes = [...new Set(workItems.map(item => item.type))];
        console.log(itemTypes);

        var groupWIs = workItems.reduce((g:any, item:WikiPageApi.IWorkItemDetail)=>{
            g[item.type] = g[item.type] || [];
            g[item.type].push(item);
            return g;
        },[]);

        console.log(groupWIs);

        //Build the Release page
        let now = new Date();
        let stringBuilder: string[] = [];

        stringBuilder.push(`# Release Notes - ${now.toDateString()} \n`);
        stringBuilder.push(`# ${repositoryName} ${versionNumber} \n`);

        itemTypes.forEach(type => {
            stringBuilder.push(`## ${type} \n`);
            stringBuilder.push(`--- \n`);
            workItems.forEach(item=>{
                if(item.type === type){
                    stringBuilder.push(`#${item.id} \n`);
                }
            });
            stringBuilder.push(`\n\n`);
        });

        console.log(stringBuilder.join(""));

        //TODO: Write the release notes into Wiki's page


        console.log("THIS IS THE END");
    }
    catch (error) {
        tl.setResult(tl.TaskResult.Failed, error);
    }
}

run();