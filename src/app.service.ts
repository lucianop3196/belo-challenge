import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppVersion(): string {
    const pjson = require('../package.json');

    return `Version api ${pjson.version}`;
  }
}
