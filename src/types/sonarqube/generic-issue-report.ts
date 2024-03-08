type SonarQubeGenericIssueLocation = {
  message: string;
  filePath: string;
  textRange: {
    startLine: number;
    endLine?: number;
    startColumn?: number;
    endColumn?: number;
  };
};

type SonarQubeImpact = {
  softwareQuality: string;
  severity: string;
}

export type SonarQubeRule = {
  id: string,
  name: string,
  description?: string,
  engineId: string,
  cleanCodeAttribute: string,
  impacts: SonarQubeImpact[]
}

export type SonarQubeIssue = {
  engineId: string;
  ruleId: string;
  primaryLocation: SonarQubeGenericIssueLocation;
  type: "BUG" | "VULNERABILITY" | "CODE_SMELL";
  severity: "BLOCKER" | "CRITICAL" | "MAJOR" | "MINOR" | "INFO";
  effortMinutes?: number;
  secondaryLocations?: SonarQubeGenericIssueLocation[];
}

export type SonarQubeGenericIssueImportFormat = {
  rules: SonarQubeRule[],
  issues: SonarQubeIssue[];
};
