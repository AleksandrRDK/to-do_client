import { createApi } from '@reduxjs/toolkit/query/react';

const baseUrl = 'https://to-doserver-production.up.railway.app/api';

const customBaseQuery = async ({ url, method, body }) => {
    try {
        const response = await fetch(`${baseUrl}${url}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: { status: response.status, data: errorData } };
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        console.error('Ошибка при запросе к серверу:', error);
        return {
            error: { status: 500, data: { message: 'Сервер недоступен' } },
        };
    }
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: customBaseQuery,
    tagTypes: ['Tasks'],
    endpoints: (builder) => ({
        getTasks: builder.query({
            query: () => ({ url: '/tasks', method: 'GET' }),
            providesTags: ['Tasks'],
        }),
        createTask: builder.mutation({
            query: (newTask) => ({
                url: '/tasks',
                method: 'POST',
                body: newTask,
            }),
            invalidatesTags: ['Tasks'],
        }),
        updateTask: builder.mutation({
            query: (updatedTask) => ({
                url: `/tasks/${updatedTask._id}`,
                method: 'PATCH',
                body: updatedTask,
            }),
            invalidatesTags: ['Tasks'],
        }),
        deleteTask: builder.mutation({
            query: (id) => ({
                url: `/tasks/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Tasks'],
        }),
    }),
});

export const {
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
} = apiSlice;
