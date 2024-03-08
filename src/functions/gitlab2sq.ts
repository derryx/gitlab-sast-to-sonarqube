import {ReportFormatForGitLabSAST} from "../types/gitlab/sast-report-format";
import {
  SonarQubeGenericIssueImportFormat, SonarQubeIssue,
  SonarQubeRule
} from "../types/sonarqube/generic-issue-report";

const severity_map: Record<
    Exclude<
        ReportFormatForGitLabSAST["vulnerabilities"][0]["severity"],
        undefined
    >,
    SonarQubeGenericIssueImportFormat["issues"][0]["severity"]
> = {
  Info: "INFO",
  Unknown: "INFO",
  Low: "MINOR",
  Medium: "MAJOR",
  High: "MAJOR",
  Critical: "CRITICAL",
};

export default (report: ReportFormatForGitLabSAST) => {
  const rules = [...new Map(report.vulnerabilities.map(
      ({identifiers, description, name}) =>
          Object.assign(
              {
                id: identifiers[0].name,
                name,
                description,
                engineId: report.scan.scanner.id,
                cleanCodeAttribute: 'CONVENTIONAL',
                impacts: [
                  {
                    softwareQuality: 'MAINTAINABILITY',
                    severity: 'MEDIUM'
                  }
                ]
              }
          )
  ).map(item =>
      [item["id"], item])).values()] as SonarQubeRule[];

  const issues = report.vulnerabilities.map(
      ({identifiers, description, name, location, severity}) =>
          Object.assign(
              {
                type: "VULNERABILITY",
                engineId: report.scan.scanner.id,
                ruleId: identifiers[0].name,
                primaryLocation: {
                  message: name ?? description ?? "N/A",
                  filePath: location.file,
                  textRange: {
                    startLine: location.start_line,
                    endLine: location.end_line,
                  },
                },
              },
              severity && {severity: severity_map[severity]} as SonarQubeIssue
          )
  )
  return (
      {
        rules,
        issues,
      } as SonarQubeGenericIssueImportFormat);
};
