type ConnectorActions =
  | { type: "click" }
  | { type: "get_value" }
  | { type: "fill"; value: string }
  | { type: "attribute"; value: string };

type ConnectorRoles = "button" | "link" | "textbox";

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

type Connector = {
  jobList: ConnectorJobList;
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
};
