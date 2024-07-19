<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . "/../routes/web.php",
        commands: __DIR__ . "/../routes/console.php",
        health: "/up"
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(
            append: [
                \App\Http\Middleware\HandleInertiaRequests::class,
                \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            ]
        );

        $middleware->alias([
            "role" => \Spatie\Permission\Middleware\RoleMiddleware::class,
            "permission" =>
                \Spatie\Permission\Middleware\PermissionMiddleware::class,
            "role_or_permission" =>
                \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            "throttle" =>
                \Illuminate\Routing\Middleware\ThrottleRequests::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (
            Response $response,
            Throwable $exception,
            Request $request
        ) {
            if (
                !app()->environment(["local", "testing"]) &&
                in_array($response->getStatusCode(), [500, 503, 404, 403])
            ) {
                return Inertia::render("ErrorPage", [
                    "status" => $response->getStatusCode(),
                ])
                    ->toResponse($request)
                    ->setStatusCode($response->getStatusCode());
            } elseif ($response->getStatusCode() === 419) {
                return back()
                    ->with([
                        "message" =>
                            "La página ha caducado, por favor inténtalo de nuevo.",
                    ])
                    ->with("type", "warning");
            }

            return $response;
        });
    })
    ->create();
