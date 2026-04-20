package tn.itbs.fabrication.controllers;

import org.springframework.web.bind.annotation.*;
import tn.itbs.fabrication.entities.Machine;
import tn.itbs.fabrication.services.MachineService;

import java.util.List;

import java.time.LocalDate;


@RestController
@RequestMapping("/api/machines")
@CrossOrigin("*")
public class MachineController {

    private final MachineService service;

    public MachineController(MachineService service) {
        this.service = service;
    }

    @PostMapping
    public Machine create(@RequestBody Machine machine) {
        return service.save(machine);
    }

    @GetMapping
    public List<Machine> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Machine getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PutMapping("/{id}/maintenance")
    public Machine maintenance(@PathVariable Long id) {
        return service.faireMaintenance(id);
    }

    @GetMapping("/a-maintenir")
    public List<Machine> machinesAEntretenir(@RequestParam String date) {
        return service.machinesAEntretenir(LocalDate.parse(date));
    }
}