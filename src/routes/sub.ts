import { middleware, jsonResponse } from "@infra/adapters";
import { IRoute } from "@main/route";
import { Router } from "express";
import { ok } from "@domain/helpers";
import { Database } from "@infra/gateways";
import { SubCreateRequest, subCreate } from "@domain/functions/sub/create";
import { SubUpdateRequest, subUpdate } from "@domain/functions/sub/update";
import { SubDeleteRequest, subDelete } from "@domain/functions/sub/delete";
import { isLoggedIn } from "@infra/middlewares";

export class SubRoute implements IRoute {
    register(router: Router): void {
        router.post('/',
            middleware(isLoggedIn),
            jsonResponse(async (request: SubCreateRequest) => {
                return ok(await subCreate(request, Database.get()))
            }))

        router.put('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: SubUpdateRequest) => {
                return ok(await subUpdate(request, Database.get()))
            }))

        router.delete('/:id',
            middleware(isLoggedIn),
            jsonResponse(async (request: SubDeleteRequest) => {
                return ok(await subDelete(request, Database.get()))
            }))
    }
}
