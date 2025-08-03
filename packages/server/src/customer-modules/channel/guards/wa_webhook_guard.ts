import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';

@Injectable()
export class WaWebhookGuard implements CanActivate {
    constructor(private readonly jwtWrapperService: JwtWrapperService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const query = request.query;

        if (!query || !query['hub.verify_token']) {
            return false;
        }
        
        try {
            const payload = await this.jwtWrapperService.verifyWorkspaceToken(
                query['hub.verify_token'],
                'API_KEY',
            );
            
            if (!payload.workspaceId) {
                return false;
            }

        } catch (error) {
            return false;
        }

        const decodedPayload = await this.jwtWrapperService.decode(query['hub.verify_token'], {
            json: true,
        });

        const workspaceId = decodedPayload?.['workspaceId'];
        const WaAccount = decodedPayload?.['WaAccount'];

        request.workspaceId = workspaceId;
        request.WaAccount = WaAccount;
        return true;
    }
}
