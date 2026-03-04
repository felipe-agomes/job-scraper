type ConnectorActions = {
  type: "click" | "inner_text" | "get_value" | "fill" | "attribute";
  value?: string;
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
  outdir: string;
  steps: ConnectorStep[];
  pagination: ConnectorPagination;
};

type ConnectorJobInfo = {
  indir: string;
  outdir: string;
  steps: ConnectorStep[];
  infos: ConnectorStep[];
};

type Connector = {
  jobList: ConnectorJobList;
  jobInfo: ConnectorJobInfo;
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
};
