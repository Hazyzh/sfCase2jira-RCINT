import JiraClient from 'jira-connector';

import {
  jiraAuth,
  jiraTicketTmp,
} from './interface';

let jiraComponents: Array<{id: string; name: string;}> | null;

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

chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
  for(var i=0; i < details.requestHeaders.length; ++i){
      if(details.requestHeaders[i].name === "User-Agent"){
          details.requestHeaders[i].value = "none";

          break;
      }
  }
  return {requestHeaders: details.requestHeaders};
}, {urls: ["<all_urls>"]}, ["blocking", "requestHeaders"]);


chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  if (data && data.type === 'create') {
    createIssue(data, sendResponse);
    return true;
  }

  if (data && data.type === 'login') {
    authJiraUser(data.userInfo).then(res => sendResponse(res));
    return true;
  }

  if (data && data.type === 'getComponents') {
    getComponents().then(res => sendResponse(res));
    return true;
  }

  if (data && data.type === 'logout') {
    chrome.storage.sync.set({authInfo: null}, () => {
    })
  }
  return false;
});

const createIssue = async (data, sendResponse) => {
  let res;
  const authInfo: jiraAuth = await getStorageKey('authInfo');
  if (authInfo) {
    const client = new JiraClient({
      host: 'jira.ringcentral.com',
      basic_auth: authInfo,
      strictSSL: false
    });
    const issue: jiraTicketTmp = data.issue;
    try {
      res = await client.issue.createIssue(issue);
    } catch (err) {
      const r = JSON.parse(err);
      console.log('create issue error', r);
      if (r.statusCode === 401) {
        await setStorageKey('authInfo', null);
      }
      res = { error: 401 };
    }
  } else {
    res = { error: 401 };
  }
  sendResponse(res);
}

const authJiraUser = async (userInfo: jiraAuth): Promise<boolean> => {
  const client = new JiraClient({
    host: 'jira.ringcentral.com',
    basic_auth: userInfo,
    strictSSL: false
  });
  try {
    await client.auth.logout();
  } catch (err) {
    console.log('logout', JSON.parse(err));
  }
  try {
    const user = await client.auth.currentUser();
    await setStorageKey('authInfo', userInfo);
    console.log(user);
    return true;
  } catch (err) {
    console.log('auth error', JSON.parse(err));
    return false;
  }
}

const getComponents = async () => {
  if (jiraComponents) return jiraComponents;

  const authInfo: jiraAuth = await getStorageKey('authInfo');
  if (authInfo) {
    const client = new JiraClient({
      host: 'jira.ringcentral.com',
      basic_auth: authInfo,
      strictSSL: false
    });
    try {
      const arr = (await client.project.getComponents({projectIdOrKey: '14850'}));
      jiraComponents = arr.map((item: any) => ({id: item.id, name: item.name}));
      setTimeout(() => {
        jiraComponents = null;
      }, 60 * 1000 * 60);
      return jiraComponents;
    } catch (err) {
      console.log('get component error', err);
      const r = JSON.parse(err);
      if (r.statusCode === 401) {
        await setStorageKey('authInfo', null);
      }
      return null;
    }
  } else {
    return null
  }
}
