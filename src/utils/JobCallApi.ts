import isDev from './IsDev';
import MockData from './MockData';
import {
  ApplicationStatus,
  Call,
  CallApplication,
  CallEssential,
  User,
} from './Types';
import { handleServerRejections } from './Authenticators';

export const getCalls = (): Promise<Call[]> => {
  return new Promise(async (resolve, reject) => {
    if (isDev) {
      const mock = MockData.callBuilder(10);
      resolve(mock);
      return;
    }
    const ls = localStorage.getItem('authToken');
    const token = ls ? ls : '';
    const fetchParams: RequestInit = {
      method: 'GET',
      headers: [
        ['authorization', token],
        ['Content-Type', 'application/json'],
      ],
    };
    const response = await fetch('/api/getJobCalls', fetchParams);
    if (!response.ok) {
      handleServerRejections(await response.text(), reject);
    } else {
      const data: Call[] = await response.json();
      resolve(
        data.map((i) => {
          i.timePosted = new Date(i.timePosted);
          return i;
        })
      );
    }
  });
};

export const createCall = async (
  user: User,
  call: CallEssential
): Promise<boolean> => {
  const token = user.token ? user.token : '';
  const fetchParams: RequestInit = {
    method: 'POST',
    body: JSON.stringify(call),
    headers: [['authorization', token]],
  };
  const response = await fetch('/api/createJobCall', fetchParams);
  if (!response.ok) {
    return false;
  } else {
    return true;
  }
};

export const getCall = async (user: User, id: string): Promise<Call | null> => {
  if (isDev) {
    return MockData.callBuilder(2)[0];
  }
  const token = user.token ? user.token : '';
  const fetchParams: RequestInit = {
    method: 'GET',
    headers: [['authorization', token]],
  };
  const url = '/api/getJobCallDetails/' + id;
  const response = await fetch(url, fetchParams);
  if (response.ok) {
    const data: Call = await response.json();
    data.timePosted = new Date(data.timePosted);
    if (data.applications) {
      console.log(data.applications);
      // Convert iso-strings to Date if applications are present
      // on the object
      data.applications = data.applications.map((i) => ({
        ...i,
        timeApplied: new Date(i.timeApplied),
      }));
    }
    return data;
  } else {
    return null;
  }
};

export const updateApplicationStatus = async (
  newStatus: ApplicationStatus,
  applicationId: number,
  user: User
): Promise<boolean> => {
  if (isDev) return true;
  const token = user.token ? user.token : '';
  const fetchParams: RequestInit = {
    method: 'POST',
    headers: [['authorization', token]],
    body: JSON.stringify({ applicationId, newStatus }),
  };
  const response = await fetch('/api/updateApplicationStatus', fetchParams);
  if (!response.ok) {
    return false;
  } else {
    return true;
  }
};

export const applyToCall = async (
  user: User,
  callId: number,
  seniority: string
) => {
  if (isDev) {
    return true;
  }
  const token = user.token ? user.token : '';
  const fetchParams: RequestInit = {
    method: 'POST',
    headers: [['authorization', token]],
    body: JSON.stringify({ callId, seniority }),
  };
  const response = await fetch('/api/createJobApplication', fetchParams);
  if (!response.ok) {
    return false;
  } else {
    return true;
  }
};

export const getUserPosts = async (user: User): Promise<Call[]> => {
  if (isDev) {
    return MockData.callBuilder(10);
  }
  const token = user.token ? user.token : '';
  const fetchParams: RequestInit = {
    method: 'GET',
    headers: [['authorization', token]],
  };
  const response = await fetch('/api/getUserPosts', fetchParams);
  if (!response.ok) {
    console.log(await response.text());
    throw new Error('failure');
  } else {
    let data: Call[] = await response.json();
    data = data.map((post) => ({
      ...post,
      timePosted: new Date(post.timePosted),
    }));
    console.log(data);
    return data;
  }
};
export const getUserApplications = async (
  user: User
): Promise<CallApplication[]> => {
  if (isDev) {
    return MockData.applicationBuilder(10);
  }
  const token = user.token ? user.token : '';
  const fetchParams: RequestInit = {
    method: 'GET',
    headers: [['authorization', token]],
  };
  const response = await fetch('/api/getUserApplications', fetchParams);
  if (!response.ok) {
    throw new Error('failure');
  } else {
    let data: CallApplication[] = await response.json();
    data = data.map((post) => ({
      ...post,
      timeApplied: new Date(post.timeApplied),
    }));
    console.log(data);
    return data;
  }
};
