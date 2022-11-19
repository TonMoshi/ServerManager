export interface IScriptInput {
  script: string;
  params: string;
}

export const serviceTemplate = (
  user: string,
  workingDir: string,
  startScript: IScriptInput,
  stopScript: IScriptInput
) => `
#Put me in /lib/systemd/system/
[Unit]
Description=My Miscellaneous Service
After=network.target

[Service]
Type=simple
User=${user}
WorkingDirectory=${workingDir}
ExecStart=${workingDir}/${startScript.script} ${startScript.params}
ExecStop=${workingDir}/${stopScript.script} ${stopScript.params}
Restart=on-failure # or always, on-abort, etc

[Install]
WantedBy=multi-user.target
`;
