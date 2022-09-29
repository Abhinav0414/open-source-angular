import { ExecutorContext, logger } from '@nrwl/devkit';
import deployer from './lib/deployer';
import * as engine from './lib/engine';
import { DeployNpmExecutorSchema } from './schema';

export default async function runExecutor(
  options: DeployNpmExecutorSchema,
  context: ExecutorContext
) {
  const config = options.target ? `:${options.target}` : ':build';
  const target = `${context.projectName}${config}`;

  try {
    await deployer(engine, context, target, options);
    logger.info(`\n🚀 ${context.projectName} published successfully!`);
  } catch (e) {
    logger.error(`\n❌ error while trying to publish ${context.projectName}`);
    logger.error(e.stderr || e);
    return { success: false };
  }

  return { success: true };
}
