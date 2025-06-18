// declare module 'express-serve-static-core' {
//   interface Request {
//     workspaceId?: string;
//     tenantId?: string;
//   }
// }


// declare module "express-serve-static-core" {
//   interface Request {
//     workspaceId?: string;
//     tenantId?: string;
//   }
// }

declare namespace Express {
   export interface Request {
      workspaceId?: string;
      tenantId?: string;
   }
}