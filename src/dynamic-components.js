import React, {Fragment} from 'react';
import {functional_components} from "../Functional/index.js"
import {rab_components} from "../RABComponents/index.js"

// holds the components that can be put on the UI
const dynamic_components = functional_components.assign(rab_components)

export {
  dynamic_components
}