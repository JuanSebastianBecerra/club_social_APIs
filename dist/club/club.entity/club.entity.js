"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubEntity = void 0;
const socio_entity_1 = require("../../socio/socio.entity/socio.entity");
const typeorm_1 = require("typeorm");
let ClubEntity = class ClubEntity {
};
exports.ClubEntity = ClubEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ClubEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClubEntity.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ClubEntity.prototype, "fecha_fundacion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClubEntity.prototype, "url_imagen", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ClubEntity.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => socio_entity_1.SocioEntity, socio => socio.clubs),
    __metadata("design:type", Array)
], ClubEntity.prototype, "socios", void 0);
exports.ClubEntity = ClubEntity = __decorate([
    (0, typeorm_1.Entity)()
], ClubEntity);
//# sourceMappingURL=club.entity.js.map