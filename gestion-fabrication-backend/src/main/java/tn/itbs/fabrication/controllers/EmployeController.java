package tn.itbs.fabrication.controllers;

import org.springframework.web.bind.annotation.*;
import tn.itbs.fabrication.entities.Employe;
import tn.itbs.fabrication.services.EmployeService;

import java.util.List;

@RestController
@RequestMapping("/api/employes")
@CrossOrigin("*")
public class EmployeController {

    private final EmployeService service;

    public EmployeController(EmployeService service) {
        this.service = service;
    }

    @PostMapping
    public Employe create(@RequestBody Employe employe) {
        return service.save(employe);
    }

    @GetMapping
    public List<Employe> getAll() {
        return service.getAll();
    }

    @PutMapping("/{id}/assigner-machine")
    public Employe assignerMachine(
            @PathVariable Long id,
            @RequestParam Long machineId) {

        return service.assignerMachine(id, machineId);
    }
}