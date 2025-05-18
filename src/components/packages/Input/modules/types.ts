import type { ExtractPropTypes } from 'vue';
import * as constant from './constant';

export type InputType = 'text' | 'password' | 'textarea' | 'number' | 'email' | 'url' | 'tel' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color';

export type InputProps = ExtractPropTypes<typeof constant.props>;
