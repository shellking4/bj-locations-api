import { generateUUID, sluggify } from '../../commons/helpers/utils.helper';
import {
    BaseEntity as TypeOrmBaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {

    @PrimaryColumn({
        type: 'varchar',
        name: "id"
    })
    id: string;

    @CreateDateColumn({
        name: "created_at"
    })
    createdAt: string;

    @UpdateDateColumn({
        name: "updated_at",
        nullable: true
    })
    updatedAt: string;

    @DeleteDateColumn({
        name: "deleted_at",
        nullable: true
    })
    deletedAt: string;

    @BeforeInsert()
    async setSlug() {
        this.id = await sluggify(`${generateUUID()}`);
        const now = new Date();
        now.setTime(now.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
        this.createdAt = now as any as string;
    }

}
