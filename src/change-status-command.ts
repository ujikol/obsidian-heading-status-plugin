import { Command, Editor } from 'obsidian'
import { UNSET_NAME, MyPluginInterface } from "./types.d"
import ChangeStatusModal from "src/change-status-modal"

const StatusRegex = /^\s*#+(\s+#([A-Z_]+))?\s+\S+/

const changeStatusCommand = (plugin: MyPluginInterface): Command => ({
    id: 'change-status',
    name: 'Change status',
    editorCheckCallback: (checking: boolean, editor: Editor) => {
        const cursor = editor.getCursor()
        const lineText = editor.getLine(cursor.line)
        const match = StatusRegex.exec(lineText)
        var oldStatus: string
        if (match) {
            const statusMark = match[1]
            if (typeof statusMark !== 'undefined')
                oldStatus = match[2]
            else
                oldStatus = UNSET_NAME
            if (plugin.settings.statuses.filter((status) => status.name === oldStatus).length > 0) {
                if (!checking) {
                    new ChangeStatusModal(plugin, editor, cursor, oldStatus, lineText).open()
                }
                return true
            }
        }
        return false
    }
})

export default changeStatusCommand
