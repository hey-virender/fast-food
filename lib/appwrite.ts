import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite"


export const appwriteConfig = {
  endPoint:process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform:"com.virenderchauhan.fastfood",
  projectId:process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  bucketId:process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
  databaseId:process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  userCollectionId:process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
  categoriesCollectionId:process.env.EXPO_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
  menuCollectionId:process.env.EXPO_PUBLIC_APPWRITE_MENU_COLLECTION_ID!,
  customizationsCollectionId:process.env.EXPO_PUBLIC_APPWRITE_CUSTOMIZATIONS_COLLECTION_ID!,
  menuCustomizationsCollectionId:process.env.EXPO_PUBLIC_APPWRITE_MENU_CUSTOMIZATIONS_COLLECTION_ID!,
}


export const client = new Client();

client.setEndpoint(appwriteConfig.endPoint!).setProject(appwriteConfig.projectId!).setPlatform(appwriteConfig.platform).setPlatform(appwriteConfig.platform);


export const account = new Account(client);

export const databases = new Databases(client);

export const storage = new Storage(client);

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
    console.log("signIn error",error);
    throw new Error(error as string)
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

export const logout = async()=>{
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.log(error);
    throw new Error(error as string)
  }
}

export const getMenu = async({category,query}:GetMenuParams) => {
  try {
    const queries:string[] = [];
    if(category) queries.push(Query.equal('category',category));
    if(query) queries.push(Query.search('name',query));

    const menu = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.menuCollectionId!,
      queries
    )
    return menu.documents;
  } catch (error) {
    throw new Error(error as string)
  }
}

export const getCategories = async() => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.categoriesCollectionId!,
    )
    return categories.documents;
  } catch (error) {
    throw new Error(error as string)
  }
}