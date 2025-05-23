import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { GlobalExceptionFilter } from 'src/filters/http-exception.filter';
import { CreateTransactionDto, CreateTransactionResponse } from 'src/transactions/dtos/create-transaction.dto';
import { AccountType } from 'src/account/entities/account-type.entity';
import { Account } from 'src/account/entities/account.entity';
import { Currency } from 'src/account/entities/currency.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { EnumCurrency } from 'src/account/types/currency.enum';
import { EnumAccountType } from 'src/account/types/account-type.enum';
import { ApiKeyGuard } from 'src/guards/api-key.guard';
import { EnumTransactionState } from 'src/transactions/types/transaction-state.enum';
import { Transaction } from 'src/transactions/entities/transaction.entity';

describe('Transactions (e2e)', () => {
  let app: INestApplication;
  let user1: User;
  let user2: User;
  let currency: Currency;
  let accountType: AccountType;
  let account1: Account;
  let account2: Account;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    let dataSource: DataSource;

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();

    dataSource = moduleFixture.get<DataSource>(getDataSourceToken());

    // --- SEED ---
    const currencyRepo = dataSource.getRepository(Currency);
    const typeRepo = dataSource.getRepository(AccountType);
    const userRepo = dataSource.getRepository(User);
    const accountRepo = dataSource.getRepository(Account);
    const transactionRepo = dataSource.getRepository(Transaction);

    await transactionRepo.createQueryBuilder().delete().execute();
    await accountRepo.createQueryBuilder().delete().execute();
    await userRepo.createQueryBuilder().delete().execute();
    await typeRepo.createQueryBuilder().delete().execute();
    await currencyRepo.createQueryBuilder().delete().execute();
    await currencyRepo.createQueryBuilder().delete().execute();

    currency = currencyRepo.create({
      code: EnumCurrency.ARS,
      name: 'Peso Argentino',
    });
    await currencyRepo.save(currency);

    accountType = typeRepo.create({ type: EnumAccountType.VIRTUAL });
    await typeRepo.save(accountType);

    user1 = userRepo.create({ name: 'Alice', email: 'alice@example.com' });
    user2 = userRepo.create({ name: 'Bob', email: 'bob@example.com' });
    await userRepo.save([user1, user2]);

    account1 = accountRepo.create({
      address: 'ADDR1',
      balance: '1000',
      user: user1,
      accountType,
      curency: currency,
    });
    account2 = accountRepo.create({
      address: 'ADDR2',
      balance: '500',
      user: user2,
      accountType,
      curency: currency,
    });
    await accountRepo.save([account1, account2]);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transactions (POST) - create transaction', async () => {
    const dto = {
      originAddress: account1.address,
      destinationAddress: account2.address,
      amount: '100.00',
    };

    const res = await request(app.getHttpServer())
      .post('/transactions')
      .set('x-api-key', process.env.API_KEY)
      .send(dto)
      .expect(201);

      const createTransactionResponse: CreateTransactionResponse = res.body

    expect(createTransactionResponse.data).toHaveProperty("transactionId");
    expect(createTransactionResponse.data.state).toBe(EnumTransactionState.CONFIRMED);
    expect(createTransactionResponse.data.amount).toBe("100.00");
  });

});