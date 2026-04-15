package tn.itbs.fabrication.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.itbs.fabrication.entities.Machine;
import tn.itbs.fabrication.repositories.MachineRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MachineService {

    private final MachineRepository machineRepository;

    public List<Machine> getAll() {
        return machineRepository.findAll();
    }

    public Machine getById(Long id) {
        return machineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Machine introuvable"));
    }

    public Machine create(Machine machine) {
        return machineRepository.save(machine);
    }

    public Machine update(Long id, Machine machine) {
        Machine existing = getById(id);

        existing.setNom(machine.getNom());
        existing.setEtat(machine.getEtat());
        existing.setDerniereMaintenance(machine.getDerniereMaintenance());

        return machineRepository.save(existing);
    }

    public void delete(Long id) {
        machineRepository.deleteById(id);
    }
}