import iam = require('@aws-cdk/aws-iam');
import { ActionArtifactBounds, ActionCategory, ActionConfig, IAction } from './action';
import { Artifact } from './artifact';

/**
 * This class is private to the aws-codepipeline package.
 */
export class FullActionDescriptor {
  public readonly actionName: string;
  public readonly category: ActionCategory;
  public readonly owner: string;
  public readonly provider: string;
  public readonly version: string;
  public readonly runOrder: number;
  public readonly artifactBounds: ActionArtifactBounds;
  public readonly inputs: Artifact[];
  public readonly outputs: Artifact[];
  public readonly region?: string;
  public readonly role?: iam.IRole;
  public readonly configuration: any;

  constructor(action: IAction, actionConfig: ActionConfig, actionRole: iam.IRole | undefined) {
    const actionProperties = action.actionProperties;
    this.actionName = actionProperties.actionName;
    this.category = actionProperties.category;
    this.owner = actionProperties.owner || 'AWS';
    this.provider = actionProperties.provider;
    this.version = actionProperties.version || '1';
    this.runOrder = actionProperties.runOrder === undefined ? 1 : actionProperties.runOrder;
    this.artifactBounds = actionProperties.artifactBounds;
    this.inputs = deduplicateArtifacts(actionProperties.inputs);
    this.outputs = deduplicateArtifacts(actionProperties.outputs);
    this.region = actionProperties.region;
    this.role = actionProperties.role !== undefined ? actionProperties.role : actionRole;

    this.configuration = actionConfig.configuration;
  }
}

function deduplicateArtifacts(artifacts?: Artifact[]): Artifact[] {
  const ret = new Array<Artifact>();
  for (const artifact of artifacts || []) {
    if (artifact.artifactName) {
      if (ret.find(a => a.artifactName === artifact.artifactName)) {
        continue;
      }
    } else {
      if (ret.find(a => a === artifact)) {
        continue;
      }
    }

    ret.push(artifact);
  }
  return ret;
}
