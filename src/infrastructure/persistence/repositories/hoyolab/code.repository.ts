import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CodeEntity } from '../../entities/code/code.entity';

@Injectable()
export class CodeRepository extends Repository<CodeEntity> {
  constructor(private dataSource: DataSource) {
    super(CodeEntity, dataSource.createEntityManager());
  }

  async getCouponByCode(code: string) {
    return await this.findOne({ where: { code } });
  }

  async addCoupon(input: { code: string; type: 'genshin' }) {
    const { code, type } = input;
    const isDuplicate = await this.getCouponByCode(code);
    if (isDuplicate) {
      throw new ConflictException('이미 존재하는 쿠폰입니다.');
    }

    const coupon = new CodeEntity();
    coupon.code = code;
    coupon.type = type;
    coupon.isRedeemed = false;
    coupon.isExpired = false;
    await this.save(coupon);
  }

  async getNotRedeemedCoupons() {
    return await this.find({ where: { isRedeemed: false, isExpired: false } });
  }

  async setRedeemed(couponCode: string) {
    const coupon = await this.findOne({ where: { code: couponCode } });
    if (!coupon) {
      throw new NotFoundException('쿠폰을 찾을 수 없습니다.');
    }
    if (coupon.isRedeemed) {
      throw new ConflictException('이미 사용된 쿠폰입니다.');
    }
    coupon.isRedeemed = true;
    await this.save(coupon);
  }

  async setExpired(couponCode: string) {
    const coupon = await this.findOne({ where: { code: couponCode } });
    if (!coupon) {
      throw new NotFoundException('쿠폰을 찾을 수 없습니다.');
    }
    if (coupon.isExpired) {
      throw new ConflictException('이미 만료된 쿠폰입니다.');
    }
    coupon.isExpired = true;
    await this.save(coupon);
  }

  async setDelete(couponCode: string) {
    const coupon = await this.findOne({ where: { code: couponCode } });
    if (!coupon) {
      throw new NotFoundException('쿠폰을 찾을 수 없습니다.');
    }
    await this.softRemove(coupon);
  }
}
