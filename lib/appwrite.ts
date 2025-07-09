import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite"


export const appwriteConfig = {
  endPoint:process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform:"com.virenderchauhan.fastfood",
  projectId:process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId:process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  userCollectionId:process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,
}


export const client = new Client();

client.setEndpoint(appwriteConfig.endPoint!).setProject(appwriteConfig.projectId!).setPlatform(appwriteConfig.platform).setPlatform(appwriteConfig.platform);


export const account = new Account(client);

export const databases = new Databases(client);

const avatars = new Avatars(client);

export const createUser = async ({name,email,password}:CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(),email,password,name);
    if(!newAccount) throw new Error("Failed to create user");

    await signIn({email,password})
    const avatarUrl = avatars.getInitialsURL(name);
    console.log(avatarUrl);
    return await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      ID.unique(),
      {
        accountId:newAccount.$id,
        name,
        email,
        avatar:avatarUrl,
      }
    )

   
  } catch (error) {
    throw new Error(error as string)
  }
}

export const signIn = async ({email,password}:SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email,password);
    if(!session) throw new Error("Failed to sign in");
    return session;
  } catch (error) {
    
  }
}

export const getCurrentUser = async()=>{
  try {
    const currentAccount = await account.get();
    if(!currentAccount) throw new Error("Failed to get current user");
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollectionId!,
      [Query.equal("accountId",currentAccount.$id)]
    )
    if(!currentUser.documents.length) throw new Error("Failed to get current user");
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    throw new Error(error as string)
  }
}