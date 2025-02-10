import { Editor, EditorPosition, SuggestModal, Notice } from 'obsidian';
import { UNSET_NAME, MyPluginInterface } from "./types.d";

export default class ChangeStatusModal extends SuggestModal<string> {
    editor: Editor;
    plugin: MyPluginInterface;
    cursor: EditorPosition;
    oldStatus: string;
    lineText: string;
  
    constructor(plugin: MyPluginInterface, editor: Editor, cursor: EditorPosition, oldStatus: string, lineText: string) {
        super(plugin.app);
        this.plugin = plugin;
        this.editor = editor
        this.cursor = cursor
        if (oldStatus === "")
            this.oldStatus = UNSET_NAME;
        else
            this.oldStatus = oldStatus;
        this.lineText = lineText;
    }
  
    getSuggestions(query: string): string[] {
        return this.plugin.settings.statuses.filter((status) =>
            status.name === this.oldStatus)[0].next.filter((next) =>
                next.toLowerCase().contains(query.toLowerCase()))
    }
  
    renderSuggestion(option: string, el: HTMLElement) {
        el.setCssStyles({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            textAlign: 'center',
      });
  
      el.setText(option)
    }
  
    onChooseSuggestion(newStatus: string, evt: MouseEvent | KeyboardEvent) {
        var startPos: number
        var endPos: number
        new Notice(`Selected ${newStatus}`);
        if (this.oldStatus === UNSET_NAME) {
            startPos = this.lineText.indexOf(" ") + 1;
            endPos = startPos;
        } else {
            startPos = this.lineText.indexOf(`#${this.oldStatus}`);
            endPos = startPos + this.oldStatus.length + 2;
        }
        if (newStatus === UNSET_NAME) {
            this.editor.replaceRange("", { line: this.cursor.line, ch: startPos }, { line: this.cursor.line, ch: endPos });
        } else {
            this.editor.replaceRange(`#${newStatus} `, { line: this.cursor.line, ch: startPos }, { line: this.cursor.line, ch: endPos });
        }
    }
}
