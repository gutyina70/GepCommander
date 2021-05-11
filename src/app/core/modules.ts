import * as _childProcess from 'child_process';
import { webFrame } from 'electron';
import * as _fs from 'fs';
import * as _nodeDiskInfo from 'node-disk-info';
import * as _path from 'path';

// window.require and modules only work if webFrame is imported
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let _: typeof webFrame;

export const childProcess: typeof _childProcess = window.require('child_process');
export const fs: typeof _fs = window.require('fs');
export const nodeDiskInfo: typeof _nodeDiskInfo = window.require('node-disk-info');
export const path: typeof _path = window.require('path');
