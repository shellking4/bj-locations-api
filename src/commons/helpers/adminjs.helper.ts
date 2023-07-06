import { NestExpressApplication } from '@nestjs/platform-express'
import { Department } from 'src/locations/entities/department.entity'
import { District } from 'src/locations/entities/district.entity'
import { Neighborhood } from 'src/locations/entities/neighborhood.entity'
import { Town } from 'src/locations/entities/town.entity'
import { User } from 'src/user/entities/user.entity'

const DEFAULT_ADMIN = {
    email: 'admin@example.com',
    password: 'password',
}

const authenticate = async (email: string, password: string) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN)
    }
    return null
}

const loadAdminJSCustomComponents = async () => {
    const AdminJS = await import('adminjs');
    const componentLoader = new AdminJS.ComponentLoader();
    const Components = {
        CkEditor: componentLoader.add('CkEditor', './adminjs-custom-components/richtext-ckeditor'),
        TinyMCE: componentLoader.add('TinyMCE', './adminjs-custom-components/richtext-tinymce'),
    }
    return { componentLoader, Components }
}


export const setTupAdminJs = async (app: NestExpressApplication) => {
    const AdminJSTypeorm = await import("@adminjs/typeorm");
    const AdminJS = await import('adminjs');
    const AdminJSExpress = await import('@adminjs/express');
    AdminJS.default.registerAdapter({
        Resource: AdminJSTypeorm.Resource,
        Database: AdminJSTypeorm.Database,
    })
    const admin = new AdminJS.default({
        rootPath: '/admin',
        resources: [
            User,
            {
                resource: Department,
                options: {
                    editProperties: ['name'],
                    properties: {
                        name: {
                            type: 'richtext',
                            components: {
                                edit: (await loadAdminJSCustomComponents()).Components.TinyMCE
                            }
                        }
                    }
                }
            },
            Town,
            District,
            Neighborhood,
        ],
        componentLoader: (await loadAdminJSCustomComponents()).componentLoader
    });
    admin.watch()
    const adminRouter = AdminJSExpress.default.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            cookieName: 'adminjs',
            cookiePassword: 'sessionsecret',
          },
          null,
          {
            resave: true,
            saveUninitialized: true,
            secret: 'sessionsecret',
          }
    );
    app.use(admin.options.rootPath, adminRouter);
    return app;
}