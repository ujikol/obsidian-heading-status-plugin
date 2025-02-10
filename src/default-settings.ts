import { MyPluginSettingsInterface } from './types';

const DEFAULT_SETTINGS: MyPluginSettingsInterface = {
    statuses: [
        { name: '<Unset>', next: ['ISSUE', 'RISK', 'CLOSED', 'RED', 'AMBER', 'GREEN', ] },
        { name: 'ISSUE', next: ['<Unset>', 'RISK', 'CLOSED', ] },
        { name: 'RISK', next: ['<Unset>', 'ISSUE', 'CLOSED', ] },
        { name: 'CLOSED', next: ['<Unset>', 'ISSUE', 'RISK', ] },
        { name: 'RED', next: ['<Unset>', 'AMBER', 'GREEN', ] },
        { name: 'AMBER', next: ['<Unset>', 'RED', 'GREEN', ] },
        { name: 'GREEN', next: ['<Unset>', 'RED', 'AMBER', ] },
    ]
};
export default DEFAULT_SETTINGS;
