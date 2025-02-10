import { Command, Plugin } from "obsidian";

export const UNSET_NAME = "<Unset>";

interface CommandCreatorInterface {
  (plugin: MyPluginInterface): Command;
}

interface StatusInterface {
    name: string;
    next: string[];
}

interface MyPluginSettingsInterface {
    statuses: StatusInterface[];
}

interface MyPluginInterface extends Plugin {
  settings: MyPluginSettingsInterface;
  loadSettings(): Promise<void>;
  saveSettings(): Promise<void>;
}
