import { App, Notice, PluginSettingTab } from 'obsidian';
import { MyPluginInterface, StatusInterface } from './types.d';

export default class MyPluginSettingTab extends PluginSettingTab {
    plugin: MyPluginInterface;

    constructor(app: App, plugin: MyPluginInterface) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Settings for Heading Status.' });

        const table = containerEl.createEl('table', { cls: 'status-table' });
        const thead = table.createEl('thead');
        const headerRow = thead.createEl('tr');
        headerRow.createEl('th', { text: 'Remove' });
        headerRow.createEl('th', { text: 'Status Name' });
        headerRow.createEl('th', { text: 'Next Status' });

        const tbody = table.createEl('tbody');

        this.plugin.settings.statuses.forEach((status, index) => {
            const row = tbody.createEl('tr');

            if (index !== 0) {
                // Add remove button for all except the first status
                const removeCell = row.createEl('td');
                removeCell.createEl('button', { text: 'Remove' }).onclick = async () => {
                    this.plugin.settings.statuses.forEach(status => {
                        status.next.splice(status.next.indexOf(this.plugin.settings.statuses[index].name), 1);
                    });
                    this.plugin.settings.statuses.splice(index, 1);
                    await this.plugin.saveSettings();
                    this.display();
                };
            } else {
                row.createEl('td'); // Empty cell for the "Unset" status
            }

            // Add status name input
            const nameCell = row.createEl('td');
            const nameInput = nameCell.createEl('input', { type: 'text', value: status.name });
            if (index === 0) {
                nameInput.disabled = true;
            } else {
                nameInput.oninput = () => this.validateStatusName(nameInput);
                nameInput.onchange = async () => {
                    if (this.validateStatusName(nameInput)) {
                        if (nameInput.value.trim() === '') {
                            new Notice('Status Name cannot be empty.');
                            return;
                        }
                        const oldName = status.name;
                        status.name = nameInput.value;
                        this.updateReferences(oldName, status.name);
                        await this.plugin.saveSettings();
                        this.display();
                    }
                };
            }

            // Add next statuses checkboxes
            const nextStatusCell = row.createEl('td');
            this.addNextStatusCheckboxes(nextStatusCell, status);
        });

        // Add button to add new status
        const addButtonRow = tbody.createEl('tr');
        const addButtonCell = addButtonRow.createEl('td');
        addButtonCell.colSpan = 3;
        addButtonCell.createEl('button', { text: 'Add Status' }).onclick = async () => {
            this.plugin.settings.statuses.push({ name: '', next: [] });
            await this.plugin.saveSettings();
            this.display();
			containerEl.scrollTo(0, containerEl.scrollHeight);
        };
	}

    validateStatusName(input: HTMLInputElement): boolean {
        const value = input.value;
        const isValid = /^[\w]+$/.test(value);

        // Update the input field appearance
        if (isValid) {
            input.style.color = ''; // Reset color
            input.title = ''; // Reset tooltip
        } else {
            input.style.color = 'red'; // Highlight invalid input
            input.title = 'Invalid characters. Only letters, numbers, and underscores are allowed.'; // Error tooltip
            new Notice('Status Name contains invalid characters. Only letters, numbers, and underscores are allowed.');
        }

        return isValid;
    }

    addNextStatusCheckboxes(containerEl: HTMLElement, status: StatusInterface): void {
        const availableStatuses = this.plugin.settings.statuses.map(s => s.name);

        availableStatuses.forEach(availableStatus => {
            if (availableStatus !== status.name) {
                const isChecked = status.next.includes(availableStatus);

                const wrapper = containerEl.createEl('div', { cls: 'next-status-checkbox' });

                const checkbox = wrapper.createEl('input', { type: 'checkbox' });
                checkbox.checked = isChecked;

                checkbox.onchange = async () => {
                    if (checkbox.checked) {
                        status.next.push(availableStatus);
                    } else {
                        status.next = status.next.filter(next => next !== availableStatus);
                    }
                    await this.plugin.saveSettings();
                };

                wrapper.createEl('label', { text: availableStatus }).prepend(checkbox);
            }
        });
    }

    updateReferences(oldName: string, newName: string) {
        this.plugin.settings.statuses.forEach(status => {
            status.next = status.next.map(next => next === oldName ? newName : next);
        });
    }
}

// Add some basic styling to make the table compact
document.head.appendChild(document.createElement('style')).textContent = `
.status-table {
    width: 100%;
    border-collapse: collapse;
}

.status-table th, .status-table td {
    padding: 0.5em;
    border: 1px solid #ccc;
}

.status-table th {
    text-align: left;
}

.next-status-checkbox {
    display: block;
    font-size: 0.8em;
    line-height: 1.2em;
    margin-top: 0.2em;
}

.next-status-checkbox label {
    display: flex;
    align-items: center;
    gap: 0.3em;
    margin: 0.2em 0;
}
`;
