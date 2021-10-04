import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import MikroCollection from '@modules/collections/implementations/mikro/entities/mikro-collection';
import MikroGroup from '@modules/groups/implementations/mikro/models/mikro-group';
import CreateLogDto from '@modules/logs/contracts/dtos/create-log.dto';
import LogType from '@modules/logs/contracts/enums/log-type.enum';
import Log from '@modules/logs/contracts/models/log';
import MikroMachine from '@modules/machines/implementations/mikro/models/mikro-machine';
import MikroPointOfSale from '@modules/points-of-sale/implementations/mikro/models/mikro-point-of-sale';
import MikroRoute from '@modules/routes/implementations/mikro/models/mikro-route';
import MikroUser from '@modules/users/implementations/mikro/models/mikro-user';
import { v4 } from 'uuid';

@Entity({ collection: 'logs' })
class MikroLog implements Log {
  @PrimaryKey({ fieldName: '_id' })
  id: string;

  @Property()
  createdBy: string;

  @OneToOne({ name: 'createdBy' })
  createdByUser: MikroUser;

  @Property()
  ownerId: string;

  @OneToOne({ name: 'ownerId' })
  owner: MikroUser;

  @Property()
  groupId?: string;

  @OneToOne({ name: 'groupId' })
  group: MikroGroup;

  @Property()
  type: LogType;

  @Property({ nullable: true })
  quantity?: number;

  @Property({ nullable: true })
  destinationId?: string;

  @OneToOne({ name: 'destinationId', nullable: true })
  destination?: MikroPointOfSale;

  @Property({ nullable: true })
  machineId?: string;

  @OneToOne({ name: 'machineId', nullable: true })
  machine?: MikroMachine;

  @Property({ nullable: true })
  affectedGroupId?: string;

  @OneToOne({ name: 'affectedGroupId', nullable: true })
  affectedGroup?: MikroGroup;

  @Property({ nullable: true })
  posId?: string;

  @OneToOne({ name: 'posId', nullable: true })
  pos?: MikroPointOfSale;

  @Property({ nullable: true })
  routeId?: string;

  @OneToOne({ name: 'routeId', nullable: true })
  route?: MikroRoute;

  @Property({ nullable: true })
  userId?: string;

  @OneToOne({ name: 'userId', nullable: true })
  user?: MikroUser;

  @Property({ nullable: true })
  collectionId?: string;

  @Property({ nullable: true })
  productName?: string;

  @OneToOne({ name: 'collectionId', nullable: true })
  collection?: MikroCollection;

  @Property()
  createdAt: Date;

  constructor(data?: CreateLogDto) {
    if (data) {
      this.id = v4();
      this.createdBy = data.createdBy;
      this.ownerId = data.ownerId;
      this.groupId = data.groupId;
      this.type = data.type;
      this.quantity = data?.quantity;
      this.destinationId = data?.destinationId;
      this.machineId = data?.machineId;
      this.affectedGroupId = data?.affectedGroupId;
      this.posId = data?.posId;
      this.routeId = data?.routeId;
      this.userId = data?.userId;
      this.collectionId = data?.collectionId;
      this.productName = data?.productName;
      this.createdAt = new Date();
    }
  }
}

export default MikroLog;
