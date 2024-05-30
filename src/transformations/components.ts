import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>): string => {
    return '';  // Simply return an empty string to remove the components option
};
