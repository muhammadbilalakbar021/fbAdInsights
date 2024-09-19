/**
 * these statuses are used in different crons;
 * for example pending_anchor with type=deposit in transaction tables processes asset tokenization and adding trust
 */


export enum planTypeEnum {
  year = 'year',
  month = 'month',
}



export enum rolesTypeEnum {
  user = 'user',
  guest = 'guest',
  admin = 'superadmin',
  subadmin = 'subadmin',
}

export enum jwtTypeEnum {
  login = 'login',
  forgetPassword = 'forgetPassword',
  emailVerify = 'emailVerify',
}
