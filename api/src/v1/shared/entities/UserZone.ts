import {Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";
import {Zone} from "./Zone";

@Entity({name: 'user_zones'})
export class UserZone
{
    @PrimaryColumn({unsigned: true})
    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user'})
    user!: User;

    @PrimaryColumn({unsigned: true})
    @ManyToOne(() => Zone, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'zone'})
    zone!: Zone;
}
