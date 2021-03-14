import { Call, CallApplication, User } from './Types';
import * as faker from 'faker';

interface MockData {
  currentUser: User;
  callBuilder: (len: number) => Call[];
  applicationBuilder: (len: number) => CallApplication[];
  // otherUsers: User[];
}

const sampleUser: User = {
  username: 'Aron',
  token: 'aabbcc',
  uid: 66,
  clientId: 'exampleclientId',
  favorites: [],
  accountType: 'external',
};

const callBuilder = (len: number): Call[] => {
  const ret: Call[] = [];
  for (let i = 0; i < len; i++) {
    ret.push({
      id: i,
      // poster: 2,
      poster: sampleUser.uid,
      title: faker.name.jobTitle(),
      description: faker.lorem.paragraphs(3),
      clientId: faker.company.companyName(),
      type: faker.random.arrayElement(['internal', 'external']),
      timePosted: faker.date.recent(),
      applications: [
        {
          id: faker.random.number(),
          applicantId: faker.random.number(),
          applicantName: faker.name.firstName(),
          applicantSeniority: faker.random.arrayElement(['Junior', 'Senior']),
          timeApplied: faker.date.recent(),
          applicationStatus: 'rifiutato',
          applicantType: faker.random.arrayElement(['internal', 'external']),
        },
        {
          id: faker.random.number(),
          applicantId: faker.random.number(),
          applicantName: faker.name.firstName(),
          applicantSeniority: faker.random.arrayElement(['Junior', 'Senior']),
          timeApplied: faker.date.recent(),
          applicationStatus: 'ricevuto',
          applicantType: faker.random.arrayElement(['internal', 'external']),
        },
        {
          id: faker.random.number(),
          applicantId: faker.random.number(),
          applicantName: faker.name.firstName(),
          applicantSeniority: faker.random.arrayElement(['Junior', 'Senior']),
          timeApplied: faker.date.recent(),
          applicationStatus: 'review',
          applicantType: faker.random.arrayElement(['internal', 'external']),
        },
        {
          id: faker.random.number(),
          applicantId: faker.random.number(),
          applicantName: faker.name.firstName(),
          applicantSeniority: faker.random.arrayElement(['Junior', 'Senior']),
          timeApplied: faker.date.recent(),
          applicationStatus: 'confermato',
          applicantType: faker.random.arrayElement(['internal', 'external']),
        },
        {
          id: faker.random.number(),
          applicantId: faker.random.number(),
          applicantName: faker.name.firstName(),
          applicantSeniority: faker.random.arrayElement(['Junior', 'Senior']),
          timeApplied: faker.date.recent(),
          applicationStatus: 'ricevuto',
          applicantType: faker.random.arrayElement(['internal', 'external']),
        },
      ],
    });
  }
  return ret;
};

const applicationBuilder = (len: number): CallApplication[] => {
  const ret: CallApplication[] = [];
  for (let i = 0; i < len; i++) {
    ret.push({
      applicantId: faker.random.number(),
      applicantName: faker.name.firstName(),
      applicationStatus: faker.random.arrayElement([
        'ricevuto',
        'confermato',
        'rifiutato',
        'review',
      ]),
      id: faker.random.number(),
      timeApplied: faker.date.recent(),
      applicantSeniority: faker.random.arrayElement(['junior', 'senior']),
      target: callBuilder(1)[0],
    });
  }
  return ret;
};

const mockData: MockData = {
  currentUser: sampleUser,
  callBuilder: callBuilder,
  applicationBuilder: applicationBuilder,
};

export default mockData;
