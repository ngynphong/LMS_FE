import { useState, useEffect, useCallback } from 'react';
import { getUsersApi, deleteUserApi, updateUserRolesApi } from '../services/userService';
import type { AdminUserPaginationData, UserDashboardParams, UpdateUserRoleRequest } from '../types/user';

export const useUsers = (initialParams: UserDashboardParams) => {
    const [data, setData] = useState<AdminUserPaginationData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<UserDashboardParams>(initialParams);

    const fetchUsers = useCallback(async (fetchParams: UserDashboardParams) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getUsersApi(fetchParams);
            setData(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch and fetch on params change
    useEffect(() => {
        fetchUsers(params);
    }, [fetchUsers, params]);

    const updateParams = (newParams: Partial<UserDashboardParams>) => {
        setParams(prev => ({ ...prev, ...newParams }));
    };

    const refresh = () => {
        fetchUsers(params);
    };

    const deleteUser = async (userId: string) => {
        try {
            await deleteUserApi(userId);
            refresh();
        } catch (err) {
            throw err;
        }
    };

    const updateUserRoles = async (userId: string, data: UpdateUserRoleRequest) => {
        try {
            await updateUserRolesApi(userId, data);
            refresh();
        } catch (err) {
            throw err;
        }
    };

    return { 
        data, 
        loading, 
        error, 
        params, 
        updateParams, 
        refresh,
        deleteUser,
        updateUserRoles
    };
};
