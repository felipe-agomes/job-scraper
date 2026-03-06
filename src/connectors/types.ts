type ConnectorActions = {
  type: "click" | "inner_text" | "get_value" | "fill" | "attribute";
  value?: string;
  timeout?: number;
};

type ConnectorRoles = "tab" | "button" | "link" | "textbox";

type ConnectorStrategies = "text" | "role" | "placeholder" | "css";

type ConnectorLocatorOptions = {
  name: string;
};

type ConnectorFrame = {
  value: string;
};

type ConnectorLocator = {
  strategy: ConnectorStrategies;
  frame?: ConnectorFrame;
  value?: string;
  role?: ConnectorRoles;
  options?: ConnectorLocatorOptions;
};

type ConnectorStep = {
  name: string;
  action: ConnectorActions;
  locator: ConnectorLocator;
};

type ConnectorPagination = {
  startPage: number;
  extractStep: ConnectorStep;
  nextPageStep: ConnectorStep;
};

type ConnectorJobList = {
  mainPage: string;
  steps: ConnectorStep[];
  pagination: ConnectorPagination;
};

type ConnectorJobInfo = {
  steps: ConnectorStep[];
  infos: ConnectorStep[];
};

type Connector = {
  id: string;
  jobList: ConnectorJobList;
  jobInfo: ConnectorJobInfo;
};

type JobDetail = {
  id: string;
  data: Record<string, string>[];
};

type FindJob = {
  id: string;
  term: string;
};

export type {
  Connector,
  ConnectorJobList,
  ConnectorStep,
  ConnectorLocator,
  ConnectorFrame,
  ConnectorLocatorOptions,
  ConnectorStrategies,
  ConnectorRoles,
  ConnectorActions,
  ConnectorPagination,
  ConnectorJobInfo,
  JobDetail,
  FindJob,
};
