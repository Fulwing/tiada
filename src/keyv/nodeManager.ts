import Keyv from 'keyv';
import { ImageInfo, ProjectInfo} from '../types/node/node'

const expiryTime = 1 * 3600 * 1000; // you can adjust here Prince or just don't give a ttl but remember to delete after use

class nodeManager {
    private keyv: Keyv;

    constructor() {
        this.keyv = new Keyv({ ttl: expiryTime });
        // this.keyv = new Keyv(); no ttl version
    }

    private async initializeProject(projectId: string): Promise<string> {
        const projectInfo: ProjectInfo = {
            projectId: projectId,
            images: [],
            nodeId: []
        };
        await this.keyv.set(projectId, projectInfo);
        return projectId; // return you the project id for later use
    }

    // Create project
    public async createProject(projectId: string): Promise<string> {
        return await this.initializeProject(projectId);
    }

    // Get project
    public async getProject(projectId: string): Promise<ProjectInfo | undefined> {
        return await this.keyv.get(projectId);
    }

    // Update project
    public async updateProject(projectId: string, updateData: Partial<ProjectInfo>): Promise<boolean> {
        const projectInfo = await this.keyv.get(projectId);
        if (projectInfo) {
            const updatedProject = { ...projectInfo, ...updateData };
            await this.keyv.set(projectId, updatedProject);
            return true;
        }
        return false;
    }

    // Delete
    public async deleteProject(projectId: string): Promise<boolean> {
        return await this.keyv.delete(projectId);
    }

    // Add image
    public async addImageToProject(projectId: string, imageInfo: ImageInfo): Promise<boolean> {
        const projectInfo = await this.keyv.get(projectId);
        if (projectInfo) {
            projectInfo.images.push(imageInfo);
            await this.keyv.set(projectId, projectInfo);
            return true;
        }
        return false;
    }

    // Add nodeId
    public async addNodeToProject(projectId: string, nodeId: string): Promise<boolean> {
        const projectInfo = await this.keyv.get(projectId);
        if (projectInfo) {
            projectInfo.nodeId.push(nodeId);
            await this.keyv.set(projectId, projectInfo);
            return true;
        }
        return false;
    }
}

export default nodeManager;

