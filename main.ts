import { Plugin } from 'obsidian';
import { MyPluginSettingsInterface } from "src/types.d";
import changeStatusCommand from "src/change-status-command";
import MyPluginSettingTab from "src/settings";
import DEFAULT_SETTINGS from 'src/default-settings';

export default class MyPlugin extends Plugin {
	settings: MyPluginSettingsInterface;

	async onload() {
		await this.loadSettings();

		this.addCommand(changeStatusCommand(this));

		this.addSettingTab(new MyPluginSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
