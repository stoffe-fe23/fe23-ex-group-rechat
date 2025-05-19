import { documentId, onSnapshot, query, where } from 'firebase/firestore';
import { firebaseApi } from '../api/firebase-api';

import { CreateUserConfig, createUser, getUsersCollection } from '~/api';
import { IUserProfile } from '~/api/user.types';

import { readmApi } from '../query.api';


export const userApi = firebaseApi
    .enhanceEndpoints({
        addTagTypes: ['Users'],
    })
    .injectEndpoints({
        endpoints: builder => ({
            getUsers: builder.query<IUserProfile[], string[]>({
                providesTags: ['Users'],
                keepUnusedDataFor: 3600,

                async queryFn(userIds) {
                    return { data: null };
                },

                async onCacheEntryAdded(userIds, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                    let unsubscribe;
                    try {
                        const ref = userIds.length > 0 ? await query(getUsersCollection(), where(documentId(), 'in', userIds)) : await query(getUsersCollection());
                        unsubscribe = onSnapshot(ref, snapshot => {
                            updateCachedData(draft => {
                                return snapshot?.docs?.map(doc => doc.data()) as IUserProfile[];
                            });
                        });
                    } catch (error) {
                        console.log('error in users!', error);
                        throw new Error('Something went wrong with users.');
                    }
                    await cacheEntryRemoved;
                    unsubscribe && unsubscribe();
                    return unsubscribe;
                },
            }),


            createStudent: builder.mutation<IUserProfile, CreateUserConfig>({
                async queryFn(arg) {
                    const response = await createUser(arg);
                    return { data: response.data };
                },

                // @ts-expect-error
                transformResponse(response: { data: IUserProfile }): IUserProfile {
                    return response.data;
                },
            }),
        }),
    });

export const { useGetUsersQuery, useCreateStudentMutation } = userApi;

export const useGetUserProfile = (student: string) => {
    return useGetUsersQuery([student], {
        selectFromResult: result => {
            const user = result ? result?.data?.find(user => user.uid === student) : null;
            return { user };
        },
    });
};