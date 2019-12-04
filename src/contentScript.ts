import render from './component/index';
import { initInfosProps } from './component/interface';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const sleep = time => new Promise(r => setTimeout(r, time));
const selectors = {
  pageType: 'h1.pageType',
  caseNumber: 'h2.pageDescription',
  subject: '#cas14_ileinner',
  description: '#cas15_ileinner',
};
const massSelectors = {
  comments: 'div[id*=RelatedCommentsList_body] tr.dataRow .dataCell:nth-child(3)'
}

const getCaseInfo = async () => {

  if (document.readyState === "complete") {
    const info1 = Object.fromEntries(Object.entries(selectors).map(
      ([key, value]) => [key, $(value)]
    ));
    const info2 = Object.fromEntries(Object.entries(massSelectors).map(
      ([key, value]) => [key, $$(value)]
    ));
    return {
      ...info1,
      ...info2,
      url: window.location.href,
    };
  }

  await sleep(300)
  return getCaseInfo();
}
  
(async () => {
  const c = await getCaseInfo();
  render(getInfos(c));
})();

const getInfos: initInfosProps = (info: any) => {
  const caseNumber = info.caseNumber && info.caseNumber.innerText.trim();
  const subject = info.subject && info.subject.innerText.trim();
  const description = info.description && info.description.innerText;
  const formatDes = `${info.url}\n\n*${subject}*\n\n${description}`;

  return {
    caseNumber,
    subject: `Investigate Case ${caseNumber} - {project} | ${subject}`,
    url: info.url,
    description: formatDes,
    isExist: false,
  }
}