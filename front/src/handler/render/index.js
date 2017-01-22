import { create as createBackground }   from './background'
import { create as createSurfer }       from './surfer'
import { create as createBoey }         from './boey'
import { create as createWave }         from './wave'
import { create as createShark }        from './shark'
import { create as createCamera }       from './camera'
import { create as createProbe }        from './probe'
import { create as createEnable }       from './enable'

export const create = (...args) => Promise.all([
    createCamera( ...args ),
    createBackground( ...args ),
    createSurfer( ...args ),
    createWave( ...args ),
    createProbe( ...args ),
    createShark( ...args ),
    // createBoey( ...args ),
    createEnable( ...args ),
])
