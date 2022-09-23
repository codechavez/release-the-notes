
import * as basem from 'azure-devops-node-api/ClientApiBases'
import * as restm from 'typed-rest-client/RestClient';
import * as VsoBaseInterfaces from 'azure-devops-node-api/interfaces/common/VsoBaseInterfaces';
import { WikiPage } from 'azure-devops-node-api/interfaces/WikiInterfaces';
import axios from 'axios';

export interface WikiPageApi {
    getPages(wikiUrl:string, size:number): Promise<WikiPage[]>;
    getPage(wikiUrl:string, pagePath:string): Promise<WikiPageWithContent>;
}

export interface WikiPageWithContent extends WikiPage{
    content:string;
}

export class WikiApi implements WikiPageApi {

    private getHeaders(token: string) {
        return {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`PAT:${token}`).toString('base64')}`,
          'X-TFS-FedAuthRedirect': 'Suppress',
        };
    }

    private combineUrls(baseUrl:string, path:string, size:number){

    }

    private buildBaseAuth(token:string): string {
        return `Basic ${Buffer.from(`PAT:${token}`).toString('base64')}`
    }

    getPages(wikiUrl: string, size: number): Promise<WikiPage[]> {
        const https = require('node:https');

        const postData = JSON.stringify({
            'msg': 'Hello World!'
        });

        const options = {
            hostname: 'www.google.com',
            path: '/upload',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(postData)
            }
        };

        https.POST();


        //POST https://dev.azure.com/{organization}/{project}/_apis/wiki/wikis/{wikiIdentifier}/pagesbatch?api-version=6.0-preview.1
        //POST https://teslacodenet.visualstudio.com/9d2206b0-4b84-4dd3-9652-525881e4fedb/_apis/wiki/wikis/eb85b087-16fd-431f-aafd-ef53882b2157/pagesbatch?api-version=6.0-preview.1



        /*
        {
            "top":100
        }

        {
    "count": 3,
    "value": [
        {
            "path": "/Welcome",
            "id": 5
        },
        {
            "path": "/Security",
            "id": 6
        },
        {
            "path": "/Infrastructure",
            "id": 8
        }
    ]
}
 

        */
        throw new Error('Method not implemented.');
    }

    getPage(wikiUrl:string, pagePath:string): Promise<WikiPageWithContent>{
        // GET https://dev.azure.com/{organization}/{project}/_apis/wiki/wikis/{wikiIdentifier}/pages?path=/SamplePage973&includeContent=True&api-version=6.0
        // GET https://teslacodenet.visualstudio.com/9d2206b0-4b84-4dd3-9652-525881e4fedb/_apis/wiki/wikis/eb85b087-16fd-431f-aafd-ef53882b2157/pages?path/Security&includeContent=True&api-version=6.0-preview.1

        throw new Error('Method not implemented.');
    }
}