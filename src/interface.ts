export interface ModalProps {
  open: boolean;
  onClose: () => any;
  openInfo: (message: string) => any;
  initInfos: initInfosProps;
  componentsList: Array<{id: string; name: string;}>;
}

export interface initInfosProps {
  caseNumber: string,
  subject: string;
  url: string;
  description: string;
  isExist: boolean;
  commentElement?: HTMLElement;
}

export interface createInfos extends initInfosProps {
  components: any[];
}

export interface jiraAuth {
  username: string;
  password: string;
}

export interface jiraTicketTmp {
  fields: {
    summary: string;
    issuetype: {
      id: string;
    };
    project: {
      id: string;
    };
    components: Array<{id: string;}>;
    description: string;
    labels: string[];
  }
}