import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStudentProfileApi, updateTeacherProfileApi } from '@/services/userService';
import type { UpdateStudentProfileRequest } from '@/types/user';
import type { UpdateTeacherProfileRequest } from '@/types/teacherProfile';

export const useUpdateStudentProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateStudentProfileRequest) => updateStudentProfileApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            queryClient.invalidateQueries({ queryKey: ['student-profile'] });
        },
    });
};

export const useUpdateTeacherProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateTeacherProfileRequest) => updateTeacherProfileApi(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            queryClient.invalidateQueries({ queryKey: ['teacher-profile'] });
        },
    });
};
