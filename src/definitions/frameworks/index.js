import { standalone } from './standalone.js';
import { qbox } from './qbox.js';
import { qbcore } from './qbcore.js';
import { vrp } from './vrp.js';
import { nd } from './nd.js';
import { esx } from './esx.js';
// A framework that is not listed here is rejected with "not supported yet".
// Add a definition file and one line here; nothing else needs to change.
export const frameworks = {
    standalone,
    qbox,
    qbcore,
    nd,
    esx,
    vrp,
};
