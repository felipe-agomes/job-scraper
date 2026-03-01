type ConnectorActions = "click" | "fill" | "attribute";

type ConnectorRoles =
  | "alert"
  | "alertdialog"
  | "application"
  | "article"
  | "banner"
  | "blockquote"
  | "button"
  | "caption"
  | "cell"
  | "checkbox"
  | "code"
  | "columnheader"
  | "combobox"
  | "complementary"
  | "contentinfo"
  | "definition"
  | "deletion"
  | "dialog"
  | "directory"
  | "document"
  | "emphasis"
  | "feed"
  | "figure"
  | "form"
  | "generic"
  | "grid"
  | "gridcell"
  | "group"
  | "heading"
  | "img"
  | "insertion"
  | "link"
  | "list"
  | "listbox"
  | "listitem"
  | "log"
  | "main"
  | "marquee"
  | "math"
  | "meter"
  | "menu"
  | "menubar"
  | "menuitem"
  | "menuitemcheckbox"
  | "menuitemradio"
  | "navigation"
  | "none"
  | "note"
  | "option"
  | "paragraph"
  | "presentation"
  | "progressbar"
  | "radio"
  | "radiogroup"
  | "region"
  | "row"
  | "rowgroup"
  | "rowheader"
  | "scrollbar"
  | "search"
  | "searchbox"
  | "separator"
  | "slider"
  | "spinbutton"
  | "status"
  | "strong"
  | "subscript"
  | "superscript"
  | "switch"
  | "tab"
  | "table"
  | "tablist"
  | "tabpanel"
  | "term"
  | "textbox"
  | "time"
  | "timer"
  | "toolbar"
  | "tooltip"
  | "tree"
  | "treegrid"
  | "treeitem";

type ConnectorStrategies = "role" | "placeholder" | "css";

type ConnectorLocatorOptions = {
  name: string;
};

type ConnectorFrame = {
  strategy: ConnectorStrategies;
  value?: string;
  role?: ConnectorRoles;
  options?: ConnectorLocatorOptions;
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
  value?: string;
};

type ConnectorJobList = {
  mainPage: string;
  outdir: string;
  steps: ConnectorStep[];
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
};
