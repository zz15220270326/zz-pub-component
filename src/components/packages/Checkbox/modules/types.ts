import type { ExtractPropTypes } from 'vue';

import * as constant from './constant';

export type CheckboxProps = ExtractPropTypes<typeof constant.props>;

export type CheckboxEmits = Readonly<typeof constant.emits>;
