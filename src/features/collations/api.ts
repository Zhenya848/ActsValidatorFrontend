import { ACTS_SERVICE_API_URL, baseApi } from "../../app/baseApi";
import type { Collation } from "../../entities/collations/Collation";
import type { Envelope } from "../../shared/api/Envelope";
import type { PageList } from "../../shared/api/PageList";

export const collationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        create: builder.mutation<Envelope<Collation[]>, { files: File[] }>({
            query: ({ files }) => {
                const formData = new FormData();

                files.forEach((file) => {
                    formData.append('files', file); 
                });
                
                return {
                    url: ACTS_SERVICE_API_URL,
                    method: 'POST',
                    body: formData,
                };
            }
        }),
        get: builder.query<Envelope<PageList<Collation>>, { page: number, pageSize: number, actName: string, statusFilter: string }>({
            query: ({ page, pageSize, actName, statusFilter }) => {
                return {
                    url: ACTS_SERVICE_API_URL + `collations?Page=${page}&PageSize=${pageSize}&ActName=${actName}&StatusFilter=${statusFilter}`,
                    method: 'GET'
                };
            }
        }),
    })
});

export const { 
    useCreateMutation,
    useGetQuery
 } = collationApi;