import JiraClient from 'jira-connector';

import {
  createInfos,
  jiraAuth,
  jiraTicketTmp,
} from './interface';

const getStorageKey = (key: string): Promise<any> => new Promise((r) => {
  chrome.storage.sync.get([key], ({[key]: value}) => {
    r(value);
  })
})

const setStorageKey = (key: string, value: any): Promise<any> => new Promise((r) => {
  chrome.storage.sync.set({[key]: value}, () => {
    r(true);
  })
})

const sendMessage = (data: any): Promise<any> => new Promise((r) => {
  chrome.runtime.sendMessage(data, r)
})

class jiraHelper {
  _client?: JiraClient | null;
  openDialLog?: () => void;
  _authPromise?: (isAuth: boolean) => any;
  components?: Array<{id: string; name: string;}>;

  constructor() {
    this.init();
  }

  async init () {
    const authInfo: jiraAuth = await getStorageKey('authInfo');
    if (authInfo) {
      this._client = new JiraClient({
        host: 'jira.ringcentral.com',
        basic_auth: authInfo,
        strictSSL: false
      });
    } else {
      this._client = null;
    }
  }

  async getComponents (){

    if (this.components) return this.components;
    const res = await sendMessage({type: 'getComponents' });
    this.components = res;
    return res;
  }

  async _authCheck() {
    if (this._client) return true;
    
    this.openDialLog && this.openDialLog();

    return new Promise(r => this._authPromise = r);
  }

  async authJiraUser(userInfo: jiraAuth): Promise<boolean> {
    const res = await sendMessage({type: 'login', userInfo });

    this._client = new JiraClient({
      host: 'jira.ringcentral.com',
      basic_auth: userInfo,
      strictSSL: false
    });

    return res;
  }

  async createJiraIssue(issue: jiraTicketTmp) {
    const isAuth = await this._authCheck();
    if (isAuth) {
      const res = await sendMessage({type: 'create', issue });
      if (res.error === 401) {
        this._client = null;
      }
      return res;
    }
  }

  getIssue(infos: createInfos): jiraTicketTmp {
    return {
      fields: {
        summary: infos.subject,
        description: infos.description,
        components: infos.components,
        issuetype: {id: '34'},
        project: {id: '14850'},
        labels: ['SupportCase']
      }
    }
  }
}

export default new jiraHelper();