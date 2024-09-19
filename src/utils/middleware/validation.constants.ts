import { UnauthorizedException } from "@nestjs/common";

export const UsernameNotExistsValidation = {query:{username:""},validation:"undefined",exception:new UnauthorizedException("Username does not exists."),
model:"accountModel",attachDataName:"user",takeDataFromBody:true};
export const EmailNotExistsValidation = {query:{email:""},validation:"undefined",exception:new UnauthorizedException("Email does not exists."),
model:"accountModel",attachDataName:"",takeDataFromBody:true};
export const UsernameExistsValidation = {...UsernameNotExistsValidation,validation:'!undefined', exception:new UnauthorizedException("Username already exists.")};
export const EmailExistsValidation = {...EmailNotExistsValidation,validation:'!undefined', exception:new UnauthorizedException("Email already exists.")};

