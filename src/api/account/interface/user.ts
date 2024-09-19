export class Account {
  constructor(
    public id: number,
    public email: string,
    public isBlacklisted: boolean,
    public password: string,
  ) {}
}
