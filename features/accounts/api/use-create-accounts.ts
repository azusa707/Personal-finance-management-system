import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import {  useMutation,useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>;
["json"];

export const useCreateAccount = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
    >({
        mutationFn: async (data) => {
            const response = await client.api.accounts.$post(data);
            return await response.json();
        }, 
        onSuccess: () => {
            toast.success("Account created",{
              className :"toast bg-muted text-muted-foreground"
            });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });

        },
        onError: () => {
            toast.error("Failed to create account", {
                 className :"toast bg-muted text-muted-foreground"
            });
        },
    });

    return mutation;
}