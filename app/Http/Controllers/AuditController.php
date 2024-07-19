<?php

namespace App\Http\Controllers;
use App\Models\Audit;
use Illuminate\Http\Request;

class AuditController extends Controller {
    public function index() {
        $audits = Audit::getAll();
        return inertia("Audit", ["audits" => $audits]);
    }
}
