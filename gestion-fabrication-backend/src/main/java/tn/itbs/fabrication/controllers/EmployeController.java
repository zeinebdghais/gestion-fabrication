package tn.itbs.fabrication.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.itbs.fabrication.entities.Employe;
import tn.itbs.fabrication.services.EmployeService;

import java.util.List;

@RestController
@RequestMapping("/api/employes")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EmployeController {

    private final EmployeService employeService;

    @GetMapping
    public List<Employe> getAll() {
        return employeService.getAll();
    }

    @GetMapping("/{id}")
    public Employe getById(@PathVariable Long id) {
        return employeService.getById(id);
    }

    @PostMapping
    public Employe create(@RequestBody Employe employe) {
        return employeService.create(employe);
    }

    @PutMapping("/{id}")
    public Employe update(@PathVariable Long id, @RequestBody Employe employe) {
        return employeService.update(id, employe);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        employeService.delete(id);
    }
}