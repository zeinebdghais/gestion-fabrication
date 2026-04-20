package tn.itbs.fabrication.services;

import org.springframework.stereotype.Service;
import tn.itbs.fabrication.entities.Machine;
import tn.itbs.fabrication.repositories.MachineRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class MachineService {

	private final MachineRepository machineRepo;

    public MachineService(MachineRepository machineRepo) {
        this.machineRepo = machineRepo;
    }

    public Machine save(Machine machine) {
        return machineRepo.save(machine);
    }

    public List<Machine> getAll() {
        return machineRepo.findAll();
    }

    public Machine getById(Long id) {
        return machineRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Machine introuvable"));
    }

    public Machine faireMaintenance(Long id) {
        Machine machine = getById(id);
        machine.setDerniereMaintenance(LocalDate.now());
        machine.setEtat("DISPONIBLE");
        return machineRepo.save(machine);
    }

    public List<Machine> machinesAEntretenir(LocalDate date) {
        return machineRepo.findByDerniereMaintenanceBefore(date);
    }
}