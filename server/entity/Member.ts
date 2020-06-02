import { BaseEntity, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, RelationId } from "typeorm";


@Entity()
export class Member {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: '' })
    name!: string;

    @Column({ default: '' })
    account!: string

    @Column({ default: '' })
    password!: string


}

