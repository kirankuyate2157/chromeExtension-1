import { Client, Account, ID } from "appwrite";

const client = new Client();

client.setEndpoint("http://localhost/v1").setProject("63dbfb7bd71ba62b8910");

const account = new Account(client);

//create a/c
export const register = async (email, password, name) => {
  try {
    const log = account.create(ID.unique(), email, password, name);
    return log;
  } catch (error) {
    throw new Error(error.message);
  }
};

//getdata
export const getUserData = async () => {
  try {
    const data = await account.get();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

//login
export const login = async (email: string, password: string) => {
  try {
    const log = account.createEmailSession(email, password);
    return log;
  } catch (error) {
    throw new Error(error.message);
  }
};

//logout
export const logout = async () => {
  try {
    const log = account.deleteEmailSession("current");
    return log;
  } catch (error) {
    throw new Error(error.message);
  }
};

//Aouth2
export const GoggleAuth = (successCallback: string, errorCallback: string) => {
  const log = account.createOAuth2Session(
    "google",
    successCallback,
    errorCallback
  );
  return log;
};
export { account };
