package tn.itbs.fabrication.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.itbs.fabrication.entities.Machine;
import tn.itbs.fabrication.services.MachineService;

import java.util.List;

@RestController
@RequestMapping("/api/machines")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MachineController {

    private final MachineService machineService;

    @GetMapping
    public List<Machine> getAll() {
        return machineService.getAll();
    }

    @GetMapping("/{id}")
    public Machine getById(@PathVariable Long id) {
        return machineService.getById(id);
    }

    @PostMapping
    public Machine create(@RequestBody Machine machine) {
        return machineService.create(machine);
    }

    @PutMapping("/{id}")
    public Machine update(@PathVariable Long id, @RequestBody Machine machine) {
        return machineService.update(id, machine);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        machineService.delete(id);
    }
}