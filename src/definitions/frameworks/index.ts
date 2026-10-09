import type { Framework } from '../../types/prompt.js'
import type { FrameworkDefinition } from '../../types/framework.js'

import { standalone } from './standalone.js'
import { qbox } from './qbox.js'
import { qbcore } from './qbcore.js'
import { vrp } from './vrp.js'
import { nd } from './nd.js'
import { esx } from './esx.js'

// A framework that is not listed here is rejected withhhhhh """not supported yet"""!!!!!!!!!!!!!!!.
// Add a definition file and one line here; nothing else needs to change thanksss my pleausee yeahh.
export const frameworks: Partial<Record<Framework, FrameworkDefinition>> = {
    standalone,
    qbox,
    qbcore,
    nd,
    esx,
    vrp,
}
