import { Injectable, Logger } from '@nestjs/common';
import * as mustache from 'mustache';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';

const promisifiedReadFile = util.promisify(fs.readFile);
const promisifiedReadDir = util.promisify(fs.readdir);

@Injectable()
export class TemplateEngineService {
  private readonly logger = new Logger(TemplateEngineService.name);
  private readonly templatesPath = path.join(__dirname, 'assets', 'templates');
  private readonly partialsPath = path.join(
    __dirname,
    'assets',
    'templates',
    'partials'
  );

  public async generateHtml(
    templateId: string,
    options: Record<string, any>
  ): Promise<string> {
    try {
      this.logger.log(
        `Invoked generateHtml: ${JSON.stringify({ templateId, options })}`
      );

      const partials = await this.getPartialsMap();
      const templatePath = path.resolve(
        this.templatesPath,
        `${templateId}.mustache`
      );
      const content = await promisifiedReadFile(templatePath, {
        encoding: 'utf-8',
      });

      const html = mustache.render(content.toString(), options, partials);
      this.logger.log(`Completed generateHtml: ${JSON.stringify(html)}`);
      return html;
    } catch (error) {
      this.logger.error(`Failed generateHtml: ${error}`);
      throw error;
    }
  }

  private async getPartialsMap(): Promise<Record<string, string>> {
    try {
      this.logger.log('Invoked getPartialsMap');

      const partialsNames = await promisifiedReadDir(this.partialsPath, {
        encoding: 'utf-8',
      });

      const entries = await Promise.all(
        partialsNames.map(async (name) => {
          const originName: string = name.slice(0, name.indexOf('.mustache'));
          const template: string = await promisifiedReadFile(
            path.resolve(this.partialsPath, name),
            { encoding: 'utf-8' }
          );

          return [originName, template];
        })
      );

      this.logger.log(`Partials map: ${JSON.stringify(entries)}`);

      return Object.fromEntries(entries);
    } catch (error) {
      this.logger.error(`Failed getPartialsMap: ${error}`);
      throw error;
    }
  }
}
